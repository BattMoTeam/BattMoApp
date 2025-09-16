const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let mainWindow;
let nextProcess;

const NEXT_PORT = 3000;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // Load the Next.js dev server or production server
  const dev = process.env.NODE_ENV !== 'production';
  const url = `http://localhost:${NEXT_PORT}`;
  mainWindow.loadURL(url);

  if (dev) mainWindow.webContents.openDevTools();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Launch Next.js server for SSR
function startNextServer() {
  const dev = process.env.NODE_ENV !== 'production';
  const nextCommand = dev ? 'next dev' : 'next start';

  nextProcess = spawn(
    nextCommand,
    [],
    {
      cwd: path.join(__dirname),
      shell: true,
      stdio: 'inherit', // forward logs to Electron console
      env: { ...process.env, PORT: NEXT_PORT },
    }
  );

  nextProcess.on('close', (code) => {
    console.log(`Next.js server exited with code ${code}`);
    app.quit();
  });
}

// App lifecycle
app.on('ready', () => {
  startNextServer();
  // Give the server a few seconds to start before opening the window
  setTimeout(createMainWindow, 3000);
});

app.on('window-all-closed', () => {
  if (nextProcess) nextProcess.kill();
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (!mainWindow) createMainWindow();
});
