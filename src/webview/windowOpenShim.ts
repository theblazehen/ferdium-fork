// Source of the window.open replacement that recipe.ts injects into a
// service's page world (see the 'inject-js-unsafe' IPC message).
//
// The routing decision has to be made in the page world, and windows the page
// actually wants have to be created with the page's own native window.open.
// A WindowProxy cannot cross the contextBridge: it arrives on the other side
// as a detached plain-object snapshot, so `popup.document`, `popup.closed`
// and friends are dead. Services rely on the genuine handle. Slack, for
// example, renders its huddle / screen-share window into the popup's document
// from the opener and closes the window again when that fails, which is why
// the huddle window used to flash up and disappear (ferdium-app#788).
//
// FORK: All service-created windows use the native path so Chromium preserves
// URL coercion and a genuine WindowProxy. The main process keeps them in-app.
export const windowOpenShim = `(() => {
  const nativeOpen = window.open;

  // FORK: Keep every service-created window inside Ferdium. Calling the
  // native implementation preserves the genuine WindowProxy required by
  // OAuth callbacks and Slack huddles; the main process applies safe window
  // options and the opener's session.
  window.open = function open(url, frameName, features) {
    return nativeOpen.call(window, url, frameName, features);
  };
})();`;
