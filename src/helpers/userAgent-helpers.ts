// FORK: Global Firefox user agent.  Electron's Chromium engine leaks its
// identity via sec-ch-ua Client Hints even when the UA string is spoofed to
// Chrome.  Using a Firefox UA bypasses Google's embedded-browser detection
// entirely (Firefox doesn't support Client Hints).  This also contributes
// to Firefox usage stats — which is a nice side-effect.
import { is64Bit, isMac, isWindows, osArch } from '../environment';

// Keep this roughly current — bump when Firefox ESR moves.
const FF_VERSION = '148.0';

const platform = (() => {
  if (isMac) return `Macintosh; Intel Mac OS X 10.15; rv:${FF_VERSION}`;
  if (isWindows) return `Windows NT 10.0; Win64; x64; rv:${FF_VERSION}`;
  const arch = is64Bit ? 'x86_64' : osArch;
  return `X11; Linux ${arch}; rv:${FF_VERSION}`;
})();

const FIREFOX_UA = `Mozilla/5.0 (${platform}) Gecko/20100101 Firefox/${FF_VERSION}`;

export default function userAgent(): string {
  return FIREFOX_UA;
}
