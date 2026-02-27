import { action, computed, makeObservable, observable, observe } from 'mobx';

import type ElectronWebView from 'react-electron-web-view';
import defaultUserAgent from '../helpers/userAgent-helpers';

const debug = require('../preload-safe-debug')('Ferdium:UserAgent');

export default class UserAgent {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _willNavigateListener = (_event: any): void => {};

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _didNavigateListener = (_event: any): void => {};

  @observable.ref webview: ElectronWebView = null;

  @observable userAgentPref: string | null = null;

  @observable overrideUserAgent = (): string => '';

  constructor(overrideUserAgent: any = null) {
    makeObservable(this);

    if (typeof overrideUserAgent === 'function') {
      this.overrideUserAgent = overrideUserAgent;
    }

    observe(this, 'webview', change => {
      const { oldValue, newValue } = change;
      if (oldValue !== null) {
        this._removeWebviewEvents(oldValue);
      }
      if (newValue !== null) {
        this._addWebviewEvents(newValue);
      }
    });
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

  // FORK: Removed userAgentWithoutChromeVersion — the "chromeless" hack
  // (sending "Chrome" without a version) actively triggered Google's bot
  // detection.  We now use a global Firefox UA instead.

  @computed get userAgent(): string {
    return this.serviceUserAgentPref || this.defaultUserAgent;
  }

  @action setWebviewReference(webview: ElectronWebView): void {
    this.webview = webview;
  }

  // FORK: Removed per-domain UA switching for accounts.google.com.
  // The global Firefox UA + sec-ch-ua header stripping handles Google
  // auth detection.  Per-navigation UA changes are no longer needed.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @action _handleNavigate(_url: string): void {
    this.webview.userAgent = this.serviceUserAgentPref || this.defaultUserAgent;
  }

  _addWebviewEvents(webview: ElectronWebView): void {
    debug('Adding event handlers');

    this._willNavigateListener = event => this._handleNavigate(event.url);
    webview.addEventListener('will-navigate', this._willNavigateListener);

    this._didNavigateListener = event => this._handleNavigate(event.url);
    webview.addEventListener('did-navigate', this._didNavigateListener);
  }

  _removeWebviewEvents(webview: ElectronWebView): void {
    debug('Removing event handlers');

    webview.removeEventListener('will-navigate', this._willNavigateListener);
    webview.removeEventListener('did-navigate', this._didNavigateListener);
  }
}
