const {ipcRenderer} = require('electron');
const content = document.querySelector("#content");
ipcRenderer.on('self-file',(event,data)=>{
    content.innerHTML = ""
})