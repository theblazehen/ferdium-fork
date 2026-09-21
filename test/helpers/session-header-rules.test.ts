import {
  composeSessionHeaders,
  ensureSessionHeaderRules,
  getSessionHeaderRules,
  matchesUrlPattern,
  registerSessionHeaderRule,
  type HeaderRule,
} from '../../src/helpers/session-header-rules';
import {
  isGoogleUrl,
  userAgentWithoutChromeVersion,
} from '../../src/helpers/userAgent-helpers';

const chromeUserAgent =
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.7977.130 Safari/537.36';

const versionlessChromeUserAgent =
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome Safari/537.36';

const detailsFor = (url: string) => ({ url });

const broadcastRule = (name: string, value: string): HeaderRule => ({
  filters: { urls: ['*://*/*'] },
  apply: headers => ({ ...headers, [name]: value }),
});

// A session accepts exactly one onBeforeSendHeaders handler, so recipe header
// rules and the Google identity rule are composed rather than competing for
// that slot. Losing either one is a real, previously observed regression: a
// recipe registering '*://*/*' (WhatsApp) silently disabled the Google rule.
describe('session header rule composition', () => {
  describe('composeSessionHeaders', () => {
    it('applies recipe rules and the Google identity together', () => {
      const headers = composeSessionHeaders(
        detailsFor('https://accounts.google.com/signin'),
        { 'User-Agent': chromeUserAgent },
        [broadcastRule('x-recipe-rule', 'whatsapp-style')],
      );

      expect(headers['x-recipe-rule']).toBe('whatsapp-style');
      expect(headers['User-Agent']).toBe(versionlessChromeUserAgent);
    });

    it('preserves header casing when rewriting the identity', () => {
      const headers = composeSessionHeaders(
        detailsFor('https://mail.google.com/'),
        { 'user-agent': chromeUserAgent },
        [],
      );

      expect(Object.keys(headers)).toEqual(['user-agent']);
      expect(headers['user-agent']).toBe(versionlessChromeUserAgent);
    });

    it('leaves non-Google requests on the versioned identity', () => {
      const headers = composeSessionHeaders(
        detailsFor('https://example.com/app'),
        { 'User-Agent': chromeUserAgent },
        [broadcastRule('x-recipe-rule', 'whatsapp-style')],
      );

      expect(headers['User-Agent']).toBe(chromeUserAgent);
      expect(headers['x-recipe-rule']).toBe('whatsapp-style');
    });

    it('skips rules whose url filters do not match', () => {
      const headers = composeSessionHeaders(
        detailsFor('https://example.com/app'),
        { 'User-Agent': chromeUserAgent },
        [
          {
            filters: { urls: ['*://*.whatsapp.com/*'] },
            apply: h => ({ ...h, 'x-whatsapp': 'yes' }),
          },
        ],
      );

      expect(headers['x-whatsapp']).toBeUndefined();
    });

    it('treats a rule with no url filters as matching everything', () => {
      const headers = composeSessionHeaders(
        detailsFor('https://example.com/app'),
        { 'User-Agent': chromeUserAgent },
        [broadcastRule('x-always', 'yes')],
      );

      expect(headers['x-always']).toBe('yes');
    });

    it('tolerates a request with no user-agent header', () => {
      const headers = composeSessionHeaders(
        detailsFor('https://accounts.google.com/signin'),
        { Accept: 'text/html' },
        [],
      );

      expect(headers).toEqual({ Accept: 'text/html' });
    });

    it('lets a later rule override an earlier one', () => {
      const headers = composeSessionHeaders(
        detailsFor('https://example.com/app'),
        {},
        [broadcastRule('x-order', 'first'), broadcastRule('x-order', 'second')],
      );

      expect(headers['x-order']).toBe('second');
    });
  });

  describe('registerSessionHeaderRule', () => {
    it('keeps rules previously registered for the same session', () => {
      const ses = {};

      registerSessionHeaderRule(ses, broadcastRule('x-first', '1'));
      registerSessionHeaderRule(ses, broadcastRule('x-second', '2'));

      expect(getSessionHeaderRules(ses).map(rule => rule.filters)).toEqual([
        { urls: ['*://*/*'] },
        { urls: ['*://*/*'] },
      ]);
    });

    it('does not clear rules when a session is re-ensured', () => {
      const ses = {};
      registerSessionHeaderRule(ses, broadcastRule('x-first', '1'));

      // A webview attaching to an already-configured session must not wipe the
      // rules a recipe registered first.
      ensureSessionHeaderRules(ses);

      expect(getSessionHeaderRules(ses)).toHaveLength(1);
    });

    it('isolates rule lists per session', () => {
      const first = {};
      const second = {};

      registerSessionHeaderRule(first, broadcastRule('x-first', '1'));

      expect(getSessionHeaderRules(first)).toHaveLength(1);
      expect(getSessionHeaderRules(second)).toHaveLength(0);
    });
  });

  describe('matchesUrlPattern', () => {
    it('matches the broadcast patterns recipes use', () => {
      expect(matchesUrlPattern('https://example.com/a', '*://*/*')).toBe(true);
      expect(matchesUrlPattern('https://example.com/a', '<all_urls>')).toBe(
        true,
      );
    });

    it('matches wildcard subdomains without matching lookalikes', () => {
      expect(
        matchesUrlPattern('https://web.whatsapp.com/', '*://*.whatsapp.com/*'),
      ).toBe(true);
      expect(
        matchesUrlPattern('https://whatsapp.com/', '*://*.whatsapp.com/*'),
      ).toBe(true);
      expect(
        matchesUrlPattern('https://notwhatsapp.com/', '*://*.whatsapp.com/*'),
      ).toBe(false);
    });

    it('respects scheme and path constraints', () => {
      expect(
        matchesUrlPattern('https://example.com/app', 'https://example.com/*'),
      ).toBe(true);
      expect(
        matchesUrlPattern('http://example.com/app', 'https://example.com/*'),
      ).toBe(false);
      expect(
        matchesUrlPattern(
          'https://example.com/other',
          'https://example.com/app',
        ),
      ).toBe(false);
    });

    it('returns false for an unparseable url', () => {
      expect(matchesUrlPattern('not a url', 'https://example.com/*')).toBe(
        false,
      );
    });
  });
});

describe('Google identity helpers', () => {
  it('covers Google-owned auth and service hosts', () => {
    expect(isGoogleUrl('https://accounts.google.com/signin')).toBe(true);
    expect(isGoogleUrl('https://mail.google.com/')).toBe(true);
    expect(isGoogleUrl('https://music.youtube.com/')).toBe(true);
    expect(isGoogleUrl('https://www.youtube.com/')).toBe(true);
    expect(isGoogleUrl('https://google.com/')).toBe(true);
  });

  it('does not match lookalike or unrelated hosts', () => {
    expect(isGoogleUrl('https://evilgoogle.com/')).toBe(false);
    expect(isGoogleUrl('https://notgoogle.com.evil.com/')).toBe(false);
    expect(isGoogleUrl('https://www.toggl.com/app/timer')).toBe(false);
    expect(isGoogleUrl('https://example.com/')).toBe(false);
  });

  it('returns false rather than throwing on a malformed url', () => {
    expect(isGoogleUrl('not a url')).toBe(false);
    expect(isGoogleUrl('')).toBe(false);
  });

  it('strips only the Chrome version token', () => {
    expect(userAgentWithoutChromeVersion(chromeUserAgent)).toBe(
      versionlessChromeUserAgent,
    );
  });

  it('is idempotent', () => {
    const once = userAgentWithoutChromeVersion(chromeUserAgent);

    expect(userAgentWithoutChromeVersion(once)).toBe(once);
  });
});
