import { app, BrowserWindow } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import isDev from 'electron-is-dev';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  win.loadURL(
    isDev
      ? 'http://localhost:5173'
      : `file://${path.join(dirname, 'dist/index.html')}`
  );

  win.webContents.on('before-input-event', (event, input) => {
    if (input.control && input.key.toLowerCase() === 'd') {
      win.webContents.toggleDevTools();
    }
  });
};

app.commandLine.appendSwitch('disable-features', 'AutofillServerCommunication');

app.whenReady().then(() => {
  if (isDev) {
    import('electron-devtools-installer').then(
      ({ default: installExtension, REACT_DEVELOPER_TOOLS }) => {
        installExtension(REACT_DEVELOPER_TOOLS)
          .then(name => console.log(`Added Extension:  ${name}`))
          .catch(err => console.error('DevTools install failed:', err));
      }
    );
    console.log("DevTools loaded.")
  }
  createWindow();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
