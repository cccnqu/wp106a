const {Menu, dialog} = require('electron').remote
const fs = require('fs')
const marked = require('marked')
let E = module.exports = {}

marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: false,
  smartLists: true,
  smartypants: false
})

var mdHtml = document.getElementById('mdHtml')
var mdSource = document.getElementById('mdSource')
var filePath = document.getElementById('filePath')

E.render = function render () {
  mdHtml.innerHTML = marked(mdSource.value)
}

E.viewSource = function () {
  mdSource.style.display = 'block'
  mdHtml.style.display = 'none'
}

E.viewHtml = function () {
  E.render()
  mdSource.style.display = 'none'
  mdHtml.style.display = 'block'
}

function newFile () {
  filePath.innerText = ''
  mdSource.value = ''
}

function saveFileAs () {
  dialog.showSaveDialog({
    filters: [ { name: 'all', extensions: [ '*' ] }, { name: 'text', extensions: [ 'txt' ] } ], 
    function (fileName) {
      if (fileName === undefined) return
      fs.writeFile(fileName, mdSource.value, function (err) {
        dialog.showMessageBox({ message: '儲存完畢！', buttons: ['OK'] })
      })
      filePath.innerText = fileName
    }
  })
}

function openFile () {
  dialog.showOpenDialog(
    function (fileName) {
      if (fileName === undefined) {
        console.log('No file selected')
        return
      }
      console.log('fileName=' + fileName)

      filePath.innerText = fileName
      fs.readFile(fileName.toString(), 'utf8', function (err, data) {
        if (err) window.alert('read fail!')
        mdSource.value = data
      })
    }
  )
}

function saveFile () {
  var fileName = filePath.innerText
//          if (fileName.trim().length === 0) window.alert('No file loaded!')
  if (fileName.trim().length === 0) {
    saveFileAs()
  }
  fs.writeFile(fileName, mdSource.value)
}

const template = [
  {
    label: 'File',
    submenu: [
      {
        label: '開新檔案',
        accelerator: 'CmdOrCtrl+N',
        click: newFile
      },
      {
        label: 'Open',
        accelerator: 'CmdOrCtrl+O',
        click: openFile
      },
      {
        label: 'Save',
        accelerator: 'CmdOrCtrl+S',
        click: saveFile
      },
      {
        label: '另存新檔',
        accelerator: 'CmdOrCtrl+A',
        click: saveFileAs
      },
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
      {
        label: '原始碼',
        click: E.viewSource // viewSource
      },
      {
        label: '預覽',
        click: E.viewHtml
      },
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
