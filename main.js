const { app, BrowserWindow } = require('electron');
const path = require('path');
const http = require('http');
const { spawn } = require('child_process');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  mainWindow.webContents.openDevTools(); 

  const loadApp = () => {
    mainWindow.loadURL('http://localhost:3000');
  };

  const checkServer = () => {
    http.get('http://localhost:3000', () => {
      console.log("Server ready, loading app");
      loadApp();
    }).on('error', () => {
      console.log("Waiting for server...");
      setTimeout(checkServer, 500);
    });
  };

  const expressProcess = spawn('npm', ['start'], {
    shell: true,
    stdio: 'inherit'
  });

  app.on('will-quit', () => {
    expressProcess.kill();
  });

  checkServer();
}

app.whenReady().then(() => {
  createWindow();
});


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
