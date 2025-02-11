const { app, BrowserWindow } = require('electron');

function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      nodeIntegration: true, // Allows you to use Node APIs in the renderer
      contextIsolation: false
    }
  });

  // Load the index.html of the app.
  win.loadFile('index.html');

  // Optionally open the DevTools.
  // win.webContents.openDevTools();
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    // On macOS it is common to re-create a window in the app when the dock icon is clicked.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications to stay open until the user quits explicitly.
  if (process.platform !== 'darwin') app.quit();
});
