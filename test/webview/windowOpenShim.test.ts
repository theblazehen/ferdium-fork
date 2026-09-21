import { runInNewContext } from 'node:vm';

import { windowOpenShim } from '../../src/webview/windowOpenShim';

// FORK: The fork routes every service-created window through the page's own
// native window.open so Chromium hands back a genuine WindowProxy, and the main
// process keeps it in-app. Upstream instead sent bare `window.open(url)` calls
// to the system browser and synthesised a placeholder object for argument-less
// calls; both of those paths are deliberately gone, because a placeholder is
// not a WindowProxy and services (Slack huddles, OAuth callbacks) write into
// the real handle.
const NATIVE_RESULT = { native: true };

function installShim() {
  const external = jest.fn();
  const nativeOpen = jest.fn<unknown, unknown[]>(() => NATIVE_RESULT);
  const window: {
    ferdium: { open: jest.Mock };
    open: (...args: unknown[]) => unknown;
  } = { ferdium: { open: external }, open: nativeOpen };
  runInNewContext(`"use strict"; (() => { ${windowOpenShim} })();`, {
    window,
    setInterval,
    clearInterval,
    setTimeout,
  });
  return { external, nativeOpen, windowOpen: window.open };
}

describe('windowOpenShim', () => {
  it('replaces window.open', () => {
    const { nativeOpen, windowOpen } = installShim();
    expect(windowOpen).not.toBe(nativeOpen);
  });

  describe('delegates to the native window.open', () => {
    it('opens natively when window features are given and returns the real result', () => {
      const { external, nativeOpen, windowOpen } = installShim();
      const result = windowOpen(
        'about:blank',
        undefined,
        'width=380,height=272,left=100,top=100',
      );
      expect(nativeOpen).toHaveBeenCalledWith(
        'about:blank',
        undefined,
        'width=380,height=272,left=100,top=100',
      );
      expect(result).toBe(NATIVE_RESULT);
      expect(external).not.toHaveBeenCalled();
    });

    it('opens natively when a target name is given', () => {
      const { external, nativeOpen, windowOpen } = installShim();
      windowOpen('https://example.com/', '_blank');
      expect(nativeOpen).toHaveBeenCalledWith(
        'https://example.com/',
        '_blank',
        undefined,
      );
      expect(external).not.toHaveBeenCalled();
    });

    it('opens natively without a url when features are given', () => {
      const { external, nativeOpen, windowOpen } = installShim();
      const result = windowOpen('', 'huddle', 'width=380,height=272');
      expect(nativeOpen).toHaveBeenCalledWith(
        '',
        'huddle',
        'width=380,height=272',
      );
      expect(result).toBe(NATIVE_RESULT);
      expect(external).not.toHaveBeenCalled();
    });

    it('does not stringify the url before handing it to the native window.open', () => {
      const { nativeOpen, windowOpen } = installShim();
      const url = new URL('https://example.com/path?x=1');
      windowOpen(url, undefined, 'popup');
      expect(nativeOpen.mock.calls[0][0]).toBe(url);
    });
  });

  describe('keeps bare-url windows in-app', () => {
    it('opens a plain url natively instead of sending it to the browser', () => {
      const { external, nativeOpen, windowOpen } = installShim();
      const result = windowOpen('https://example.com/');
      expect(nativeOpen).toHaveBeenCalledWith(
        'https://example.com/',
        undefined,
        undefined,
      );
      expect(result).toBe(NATIVE_RESULT);
      expect(external).not.toHaveBeenCalled();
    });

    it('passes a URL object through natively without stringifying it', () => {
      const { external, nativeOpen, windowOpen } = installShim();
      const url = new URL('https://example.com/path?x=1');
      windowOpen(url);
      expect(nativeOpen.mock.calls[0][0]).toBe(url);
      expect(external).not.toHaveBeenCalled();
    });

    it('treats an empty features string like no features', () => {
      const { external, nativeOpen, windowOpen } = installShim();
      windowOpen('https://example.com/', '', '');
      expect(nativeOpen).toHaveBeenCalledWith('https://example.com/', '', '');
      expect(external).not.toHaveBeenCalled();
    });
  });

  describe('when the page opens a window without arguments', () => {
    it('returns the native handle rather than a placeholder', () => {
      const { external, nativeOpen, windowOpen } = installShim();
      const result = windowOpen();

      // A real WindowProxy is the whole point: a plain object cannot back
      // `popup.document` or `popup.closed` for the opener.
      expect(result).toBe(NATIVE_RESULT);
      expect(nativeOpen).toHaveBeenCalledWith(undefined, undefined, undefined);
      expect(external).not.toHaveBeenCalled();
    });
  });
});
