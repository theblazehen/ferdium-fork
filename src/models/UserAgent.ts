import { computed, makeObservable, observable } from 'mobx';

import defaultUserAgent, {
  isGoogleUrl,
  userAgentWithoutChromeVersion,
} from '../helpers/userAgent-helpers';

export default class UserAgent {
  @observable userAgentPref: string | null = null;

  @observable overrideUserAgent = (): string => '';

  // FORK: Resolve the service URL lazily so custom URLs remain observable.
  serviceUrl: (() => string) | null;

  constructor(
    overrideUserAgent: (() => string) | null = null,
    serviceUrl: (() => string) | null = null,
  ) {
    makeObservable(this);

    if (typeof overrideUserAgent === 'function') {
      this.overrideUserAgent = overrideUserAgent;
    }
    this.serviceUrl = serviceUrl;
  }

  @computed get defaultUserAgent(): string {
    const replacedUserAgent = this.overrideUserAgent();
    if (replacedUserAgent.length > 0) {
      return replacedUserAgent;
    }

    const globalPref = window['ferdium'].stores.settings.all.app.userAgentPref;
    if (typeof globalPref === 'string') {
      const trimmed = globalPref.trim();
      if (trimmed !== '') {
        return trimmed;
      }
    }
    return defaultUserAgent();
  }

  @computed get serviceUserAgentPref(): string | null {
    if (typeof this.userAgentPref === 'string') {
      const trimmed = this.userAgentPref.trim();
      if (trimmed !== '') {
        return trimmed;
      }
    }
    return null;
  }

  @computed get userAgent(): string {
    if (this.serviceUserAgentPref) {
      return this.serviceUserAgentPref;
    }

    const baseUserAgent = this.defaultUserAgent;
    // FORK: Never change UA during navigation. Google rejects identity changes
    // inside one auth flow, and Electron can restart an in-flight form POST.
    return this.serviceUrl && isGoogleUrl(this.serviceUrl())
      ? userAgentWithoutChromeVersion(baseUserAgent)
      : baseUserAgent;
  }
}
