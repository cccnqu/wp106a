const {app, BrowserWindow} = require('electron')

function createWindow () {
  var win = new BrowserWindow({width: 400, height: 400})
  win.loadURL('file://' + __dirname + '/index.html')
}

app.on('ready', createWindow)
