const marked = require("marked");
const hljs = require("highlight.js");
const remote = require("electron").remote;

const close = e => {
  const window = remote.getCurrentWindow();
  window.close();
};

document.querySelector(".close").addEventListener("click", close);

let editor = document.getElementById("editor");

editor.oninput = function(ev) {
  //console.log(``);
  /*
  document.getElementById('get-data-mark').innerHTML =  marked(this.value);
  Array.from(document.querySelectorAll('pre code')).forEach(
    block => hljs.highlightBlock(block))*/
};
const buttonGerarEmbeded = document.getElementById("button-gerar-embed");

buttonGerarEmbeded.onclick = function() {
  let content = editor.value;
 
  let url = `https://carbon.now.sh/embed/?bg=rgba(0,0,0,0)&t=dracula&l=auto&ds=true&wc=true&wa=true&pv=15px&ph=15px&ln=false&code=`;
 
  let code = `${url}${encodeURI(content)}`;
  
  const {dialog} = require('electron').remote

  const dialogOptions = {type: 'info', buttons: ['OK', 'Cancel'],title:'Atenção', message: code}
  
  dialog.showMessageBox(dialogOptions, i => console.log(i))

};
