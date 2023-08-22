const { app, BrowserWindow, Menu } = require('electron');

let win;

async function createWindow(){
     win = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: true
      }
    })
   await win.loadFile('src/views/index.html');
    //win.webContents.openDevTools();
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

const menus =[
 {
    label: "Arquivo",
    submenu: [
        {
            label:"Novo",
            click(){
                createNewFile();
            }
        },
        {
            label:"Abrir"
        },
        {
            label:"Salvar"
        },
        {
            label:"Salvar como"
        },
        {
            label:"Fechar",
            role:process.platform === 'darwin' ? 'close' : 'quit'
        },
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