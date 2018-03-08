const {Menu, dialog} = require('electron').remote
const fs = require('fs')

const template = [
  {
    label: 'File',
    submenu: [
      {
        label: 'New',
        accelerator: 'CmdOrCtrl+N',
        click: function () {
          var text = document.getElementById('text')
          var save = confirm('是否要存檔')
          if (save === true) {
            dialog.showSaveDialog({filters: [ { name: 'text', extensions: ['txt'] } ]},
            function (fileName) { fs.writeFile(fileName, text.value); text.value = '' })
          } else {
            text.value = ''
          }
        }
      },
      {
        label: 'Open',
        accelerator: 'CmdOrCtrl+O',
        click: function () {
          dialog.showOpenDialog(
            function (fileName) {
              if (fileName === undefined) {
                console.log('No file selected')
                return
              }
              console.log('fileName=' + fileName)

              var filePath = document.getElementById('filePath')
              filePath.innerText = fileName
              fs.readFile(fileName.toString(), 'utf8', function (err, data) {
                if (err) window.alert('read fail!')
                var text = document.getElementById('text')
                text.value = data
              })
            }
          )
        }
      },
      {
        label: 'Save',
        accelerator: 'CmdOrCtrl+S',
        click: function () {
          var fileName = document.getElementById('filePath').innerText
          if (fileName.trim().length === 0) window.alert('No file loaded!')
          var text = document.getElementById('text')
          fs.writeFile(fileName, text.value)
        }
      },
      {
        label: '另存新檔',
        accelerator: 'CmdOrCtrl+Shift+S',
        click: function () {
          dialog.showSaveDialog({filters: [ { name: 'text', extensions: ['txt'] } ]},
          function (fileName) {
            var text = document.getElementById('text')
            fs.writeFile(fileName, text.value)
          }
          )
        }
      },
      { type: 'separator' },
      { label: 'Exit', role: 'close' }
    ]
  },
  {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' }
    ]
  },
  {
    label: 'View',
    submenu: [
      { role: 'reload' },
      { role: 'toggledevtools' },
      { type: 'separator' },
      { role: 'resetzoom' },
      { role: 'zoomin' },
      { role: 'zoomout' },
      { type: 'separator' },
      { role: 'togglefullscreen' }
    ]
  },
  {
    role: 'window',
    submenu: [
      { role: 'minimize' },
      { role: 'close' }
    ]
  },
  {
    role: 'help',
    submenu: [ { label: 'Learn More' } ]
  }
]

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)
