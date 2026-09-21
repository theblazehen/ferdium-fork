import { cpus } from 'node:os';
import macosVersion from 'macos-version';
import {
  chromeVersion,
  is64Bit,
  isMac,
  isWindows,
  osArch,
  osRelease,
} from '../environment';

const macOS = () => {
  const version = macosVersion() ?? '';
  let cpuName = cpus()[0].model.split(' ')[0];
  if (cpuName.includes('(')) {
    [cpuName] = cpuName.split('(');
  }
  return `Macintosh; ${cpuName} macOS ${version.replaceAll('.', '_')}`;
};

const windows = () => {
  const [majorVersion, minorVersion] = osRelease.split('.');
  const archString = is64Bit ? 'Win64' : 'Win32';
  return `Windows NT ${majorVersion}.${minorVersion}; ${archString}; ${osArch}`;
};

const linux = () => {
  const archString = is64Bit ? 'x86_64' : osArch;
  return `X11; Linux ${archString}`;
};

// FORK: Google compatibility identity. Google treats its auth endpoint and its
// own properties as one identity, so this covers both the OAuth host and the
// Google-owned service hosts (e.g. music.youtube.com).
const GOOGLE_HOSTS = ['google.com', 'youtube.com'];

export const isGoogleUrl = (value: string): boolean => {
  try {
    const { hostname } = new URL(value);
    const host = hostname.toLowerCase();
    return GOOGLE_HOSTS.some(
      domain => host === domain || host.endsWith(`.${domain}`),
    );
  } catch {
    return false;
  }
};

// FORK: Existing Google compatibility workaround, not a supported-browser UA.
export const userAgentWithoutChromeVersion = (value: string): string =>
  value.replace(/Chrome\/[\d.]+/, 'Chrome');

// FORK: Keep Electron's Chromium fingerprint internally consistent. Google
// rejects a Firefox UA backed by Chromium, while this standards-correct UA
// matches the actual engine and fixes the malformed upstream Safari token.
export default function userAgent(): string {
  const platformString = isMac ? macOS() : isWindows ? windows() : linux();
  return `Mozilla/5.0 (${platformString}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${chromeVersion} Safari/537.36`;
}
