const electron = require('electron')
const fs = require('fs')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url');
const { getEnvironmentData } = require('worker_threads');
const iconPath = path.join(__dirname, 'sirius', 'assets', 'icon.ico')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let splash

function createWindow () {
  // Create the browser window.

  mainWindow = new BrowserWindow({
    width: 800, 
    height: 600, 
    icon: iconPath, 
    autoHideMenuBar: true, 
    titleBarStyle: 'hidden', 
    webPreferences: { nodeIntegration: true, nodeIntegrationInSubFrames: true, nodeIntegrationInWorker: true, contextIsolation: false }, 
    show: false,
    titleBarOverlay: {
    color: '#0a2472ff',
    symbolColor: '#bbbbbb'
  }})

  splash = new BrowserWindow({width: 500, icon: iconPath, height: 400, transparent: true, frame: false, alwaysOnTop: true})
  splash.loadURL(path.join(__dirname, 'sirius', 'assets', 'splashscreen.html'));

  let fileContent = fs.readFileSync('faecher.json', 'utf-8')

  console.log(fileContent);
  mainWindow.webContents.executeJavaScript("localStorage.setItem('faecher', '" + fileContent + "'); console.log('" + fileContent + "');", true).then(_result => { });

  mainWindow.loadURL('about:blank')

  // and load the index.html of the app.
  setTimeout(() =>
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'sirius\\index.html'),
    protocol: 'file:',
    slashes: true
  }, {userAgent: 'Chrome', })), 0);

  mainWindow.once('ready-to-show', () => {
      splash.destroy();
      mainWindow.show();
  });


  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  let onClosing = false;
  mainWindow.on('close', (e) => {
    if (!onClosing) {
      e.preventDefault();

      try{
        mainWindow.webContents
          .executeJavaScript('localStorage.getItem("faecher");', true)
          .then(result => {
            console.log(result);
            fs.writeFileSync('faecher.json', result, 'utf-8');
        });
        //console.log(storage)

        mainWindow = null;
      }
      catch (e) {
        console.log(e);
      }

      onClosing = true;
      app.quit();
    }
  })

  mainWindow.on('closed', function () {
    /*// e.preventDefault();

    try{
      mainWindow.webContents
        .executeJavaScript('localStorage.getItem("faecher");', true)
        .then(result => {
          console.log(result);
          fs.writeFileSync('faecher.json', result, 'utf-8');
      });
      //console.log(storage)

      mainWindow = null;
    }
    catch (e) {
      console.log(e);
    }

    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    //mainWindow = null*/
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.