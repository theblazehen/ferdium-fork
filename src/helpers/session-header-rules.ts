import {
  isGoogleUrl,
  userAgentWithoutChromeVersion,
} from './userAgent-helpers';

// FORK: Electron allows exactly one webRequest.onBeforeSendHeaders handler per
// session, but two independent features need to rewrite request headers:
// recipe-supplied `modifyRequestHeaders` rules and the Google compatibility
// identity. This module composes those rules so neither silently displaces the
// other. It is deliberately free of Electron imports so it can be exercised
// directly.

// Minimal match-pattern check covering the subset recipes use (e.g. '*://*/*').
export const matchesUrlPattern = (url: string, pattern: string): boolean => {
  if (pattern === '<all_urls>' || pattern === '*://*/*') return true;
  const match = /^(\*|https?|file|ftp):\/\/([^/]*)(\/.*)$/.exec(pattern);
  if (!match) return false;
  const [, scheme, host, path] = match;
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return false;
  }
  if (scheme !== '*' && parsed.protocol !== `${scheme}:`) return false;
  if (host !== '*') {
    const bareHost = host.replace(/^\*\./, '');
    const hostMatches = host.startsWith('*.')
      ? parsed.hostname === bareHost || parsed.hostname.endsWith(`.${bareHost}`)
      : parsed.hostname === host;
    if (!hostMatches) return false;
  }
  if (path.endsWith('*')) {
    return `${parsed.pathname}${parsed.search}`.startsWith(path.slice(0, -1));
  }
  return `${parsed.pathname}${parsed.search}` === path;
};

export type HeaderRule = {
  filters: { urls?: string[] };
  apply: (headers: Record<string, string>) => Record<string, string>;
};

type RequestDetails = { url: string };

// Google treats its auth endpoint and its own properties as one identity, so
// every Google-bound request carries the versionless `Chrome` token. Applied
// per request, never per navigation: changing a UA mid-navigation cancels
// in-flight form POSTs in Electron, which breaks form-target OAuth and SAML
// sign-ins.
const rewriteGoogleUserAgent = (
  details: RequestDetails,
  headers: Record<string, string>,
): Record<string, string> => {
  if (!isGoogleUrl(details.url)) return headers;

  const userAgentHeader = Object.keys(headers).find(
    key => key.toLowerCase() === 'user-agent',
  );
  if (userAgentHeader && headers[userAgentHeader]) {
    return {
      ...headers,
      [userAgentHeader]: userAgentWithoutChromeVersion(
        headers[userAgentHeader],
      ),
    };
  }
  return headers;
};

// Rules are applied in registration order; the Google identity rule always
// runs last so a recipe cannot accidentally strip it.
export const composeSessionHeaders = (
  details: RequestDetails,
  requestHeaders: Record<string, string>,
  rules: HeaderRule[],
): Record<string, string> => {
  let headers = { ...requestHeaders };
  for (const rule of rules) {
    const { urls } = rule.filters;
    const applies =
      !urls ||
      urls.length === 0 ||
      urls.some(pattern => matchesUrlPattern(details.url, pattern));
    if (applies) {
      headers = rule.apply(headers);
    }
  }
  return rewriteGoogleUserAgent(details, headers);
};

// A sandbox session can back multiple service webviews, so its rule list is
// keyed by session identity rather than stored on the Electron object.
const sessionHeaderRules = new WeakMap<object, HeaderRule[]>();

export const registerSessionHeaderRule = (
  session: object,
  rule: HeaderRule,
): void => {
  const rules = sessionHeaderRules.get(session) ?? [];
  rules.push(rule);
  sessionHeaderRules.set(session, rules);
};

export const getSessionHeaderRules = (session: object): HeaderRule[] =>
  sessionHeaderRules.get(session) ?? [];

export const ensureSessionHeaderRules = (session: object): void => {
  if (!sessionHeaderRules.has(session)) {
    sessionHeaderRules.set(session, []);
  }
};
