var app = require('app');  // Module to control application life.
var BrowserWindow = require('browser-window');  // Module to create native browser window.

// Report crashes to our server.
require('crash-reporter').start();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the javascript object is GCed.
mainWindow = null;

//var timers=require('./timers.js');


// Quit when all windows are closed.
app.on('window-all-closed', function() {
  if (process.platform != 'darwin')
    app.quit();
});

  console.log(process.argv)



// This method will be called when Electron has done everything
// initialization and ready for creating browser windows.
app.on('ready', function() {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 1024, height: 768});
  //mainWindow = new BrowserWindow({kiosk:true});
  //https://github.com/atom/electron/blob/master/docs/api/browser-window.md



  // and load the index.html of the app.
  mainWindow.loadURL('file://' + __dirname + '/web/index.html');

  /**** paso de parámetros a l lado del renderer ***/
  if(! (process.argv[2]==undefined) ){ // 2 parametros ya por defecto vamos a por el 3º
    console.log(process.argv[2]) // el primer parametro extra lo consideramos el nombre de la playlist. Ruta absoluta
    var webContents = mainWindow.cmdParameterJSONFile=process.argv[2]
  }
  // Open the devtools.
  mainWindow.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });


});

app.on('window-all-closed', function() {
 // if (process.platform != 'darwin')
    app.quit();
});

//require('electron-debug');

global.proyectos=[];
global.indiceLista=0;
