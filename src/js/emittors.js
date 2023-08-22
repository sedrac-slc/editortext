const {ipcRenderer} = require('electron');

const title = document.querySelector('title');
const content = document.querySelector("#content");

ipcRenderer.on('self-file',(event,data)=>{
    title.innerHTML = `${data.name} | Editor`;
    content.value = data.content;
})

function handlerUpdateContent(){
    ipcRenderer.send("update-content", content.value);
}

content.addEventListener("keyup",handlerUpdateContent)