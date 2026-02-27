import type { BrowserWindow } from 'electron';

const debug = require('../../preload-safe-debug')('Ferdium:ipcApi:autoUpdate');

// FORK: Disable auto-updater entirely — return early before any IPC or updater registration
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (_params: { mainWindow: BrowserWindow; settings: any }) => {
  debug('Auto-updater disabled in fork build');
};
