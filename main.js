const { app, BrowserWindow, Menu, dialog, ipcMain, shell } = require('electron');
const fs = require('fs');
const path = require('path');

let win;

async function createWindow(){
     win = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      }
    });
   await win.loadFile('src/views/index.html');
  win.webContents.openDevTools();
  createNewFile();
  ipcMain.on('update-content',(event,data)=>{
    file.content = data;
  })
}

let file = {};
function createNewFile(){
    file = {
        name: "novo-arquivo.txt",
        content: "",
        saved: false,
        path: app.getPath("documents") + "/novo-arquivo.txt"
    }
    win.webContents.send("self-file",file);
}

function writeFile(filePath){
    try{
        fs.writeFile(filePath, file.content,(error) => {
            if(error) throw error;
            file.path = filePath;
            file.name = path.basename(filePath);
            file.saved = true;
            win.webContents.send('self-file',file);
        })
    }catch(e){

    }
}

function saveFile(){
    if(file.saved) return writeFile(file.path);
    return saveFileAs();
}

async function saveFileAs(){
    const dialogFile = await dialog.showSaveDialog({
        defaultPath: file.path
    });
    if(dialogFile.canceled) return false;
    writeFile(dialogFile.filePath);
}

function readFile(filePath){
    try{
        return fs.readFileSync(filePath,"utf8");
    }catch(e){
        return "";
    }
}

async function openFile(){
    const dialogOpen = await dialog.showOpenDialog({
        defaultPath: file.path
    });
    if(dialogOpen.canceled) return false;
    file = {
        name: path.basename(dialogOpen.filePaths[0]),
        content: readFile(dialogOpen.filePaths[0]),
        saved: true,
        path: dialogOpen.filePaths[0],
    }
    win.webContents.send("self-file",file);
}


const menus =[
 {
    label: "Arquivo",
    submenu: [
        {
            label:"Novo",
            accelerator: "CmdOrCtrl+N",
            click(){
                createNewFile();
            }
        },
        {
            label:"Abrir",
            accelerator: "CmdOrCtrl+A",
            click(){
                openFile();
            }
        },
        {
            label:"Salvar",
            accelerator: "CmdOrCtrl+S",
            click(){
                saveFile()
            }
        },
        {
            label:"Salvar como",
            accelerator: "CmdOrCtrl+Shift+S",
            click(){
                saveFileAs();
            }
        },
        {
            label:"Fechar",
            role:process.platform === 'darwin' ? 'close' : 'quit'
        },
    ]
 },

 {
    label: "Editar",
    submenu: [
        {
            label: "Desfazer",
            role: "undo"
        },
        {
            label: "Refazer",
            role: "redo"
        },
        {
            type: "separator"
        },
        {
            label: "Copiar",
            role: "copy"
        },
        {
            label: "Cotar",
            role: "cut"
        },
        {
            label: "Colar",
            role: "paste"
        }
    ]
 },{
    label:"Ajuda",
    submenu: [
        {
            label:"Video tutorial",
            click(){
                shell.openExternal("https://youtube.com")
            }
        }
    ]
 }
];

const menu = Menu.buildFromTemplate(menus);
Menu.setApplicationMenu(menu)

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })

})