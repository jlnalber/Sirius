const { ipcRenderer, ipcMain } = require('electron')
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

ipcMain.on('test', (ev, ...args) => {
  console.log('wow')
  console.log(args);
  console.log(ipcMain)
  ipcMain.emit('response', 'here')
  // ipcMain.send()
})

ipcMain.handle('an-action', (event, arg) => {
  // do stuff
  return "foo";
})

ipcMain.handle('request-file', (event, ...args) => {
  let path = arg[0];
  return readFile(path);
})

ipcMain.handle('request-whiteboard', (event, ...args) => {
  let path = args[0];
  let file = readFileUTF8(path);
  const defaultWhiteboard = '{"backgroundImage":"","backgroundColor":{"r":255,"g":255,"b":255},"pageIndex":0,"pages":[{"translateX":0,"translateY":0,"zoom":1,"content":""}]}';
  return file == '' ? defaultWhiteboard : file;
})

ipcMain.handle('write-file', (event, ...args) => {
  let path = args[0];
  let data = args[1];

  if (data instanceof ArrayBuffer) {
    data = Buffer.from(data);
  }

  let res = writeFile(path, data);
  return res;
})

ipcMain.handle('write-whiteboard', (event, ...args) => {
  let path = args[0];
  let data = args[1];
  let res = writeFileUTF8(path, data);
  return res;
})

ipcMain.handle('open-file', (event, ...args) => {
  let path = args[0];
  try {
    let dir = '';
    if (config.directories.length != 0) {
      dir = config.directories[0];
    }
    path = joinPathsForFS(dir, path);

    var exec = require('child_process').exec;
    exec('"' + path.replaceAll('/', '\\') + '"');

    return fs.openSync(path, '');
  }
  catch {
    return null;
  }
})

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let splash
let config

function createWindow () {
  // Read the config
  if (!config) {
    readConfig();
    console.log(config);
  }

  // Create the browser window.

  mainWindow = new BrowserWindow({
    width: 1200, 
    height: 800, 
    minWidth: 1100,
    minHeight: 600,
    icon: iconPath, 
    autoHideMenuBar: true, 
    webPreferences: { nodeIntegration: true, nodeIntegrationInSubFrames: true, nodeIntegrationInWorker: true, contextIsolation: false }, 
    show: false, 
    titleBarOverlay: {
    color: '#0a2472ff',
    symbolColor: '#bbbbbb'
  }})

  splash = new BrowserWindow({width: 500, icon: iconPath, height: 400, transparent: true, frame: false, alwaysOnTop: true})
  splash.loadURL(path.join(__dirname, 'sirius', 'assets', 'splashscreen.html'));

  // let fileContent = fs.readFileSync('faecher.json', 'utf-8')
  let fileContent = readFileUTF8('faecher.json');

  // Write the data from the file into the localStorage
  // console.log(fileContent);
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
      mainWindow.webContents.clearHistory();
  });


  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed. Writes the data from the local storage into a file.
  let onClosing = false;
  mainWindow.on('close', (e) => {
    if (!onClosing) {
      e.preventDefault();

      try{
        mainWindow.webContents
          .executeJavaScript('localStorage.getItem("faecher");', true)
          .then(result => {
            // console.log(result);
            writeFileUTF8('faecher.json', result);
            // fs.writeFileSync('faecher.json', result, 'utf-8');
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


// functions for communicating with the filesystem
function joinPathsForFS(dir, relativePath) {
  // joins two paths
  let path = dir;
  if (dir != '' && !dir.endsWith('/') && !relativePath.startsWith('/')) {
    path += '/';
  }
  path += relativePath;
  return path;
}

function readConfig() {
  let pathConfig = 'sirius.config.json'
  try {
    let configStr = fs.readFileSync(pathConfig, 'utf-8');
    config = JSON.parse(configStr);
  }
  catch {
    let defaultConfig = '{"directories":[""]}';
    config = JSON.parse(defaultConfig);
    try {
      fs.writeFileSync(pathConfig, defaultConfig, 'utf-8');
    }
    catch { }
  }
}

function readFileUTF8(relativePath) {
  try {
    let dir = '';
    if (config.directories.length != 0) {
      dir = config.directories[0];
    }
    let path = joinPathsForFS(dir, relativePath);
    return fs.readFileSync(path, 'utf-8');
  }
  catch {
    return '';
  }
}

function readFile(relativePath) {
  try {
    let dir = '';
    if (config.directories.length != 0) {
      dir = config.directories[0];
    }
    let path = joinPathsForFS(dir, relativePath);
    return fs.readFileSync(path);
  }
  catch {
    return '';
  }
}

function writeFile(relativePath, data) {
  for (let dir of config.directories) {
    try {
      let path = joinPathsForFS(dir, relativePath);
      checkPath(path);
      fs.writeFileSync(path, data);
      // return true;
    }
    catch {
      // return false;
    }
  }
}

function writeFileUTF8(relativePath, data) {
  for (let dir of config.directories) {
    try {
      let path = joinPathsForFS(dir, relativePath);
      checkPath(path);
      fs.writeFileSync(path, data, 'utf-8');
      // return true;
    }
    catch {
      // return false;
    }
  }
}

function checkPath(path) {
  try {
    fs.accessSync(path);
  }
  catch {
    let dir = path.substring(0, path.lastIndexOf('/'));
    fs.mkdirSync(dir, {recursive: true})
  }
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