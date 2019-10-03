const marked = require("marked");
const hljs = require("highlight.js");

const editor = document.getElementById("editor");
const buttonGerarEmbeded = document.getElementById("button-gerar-embed");

editor.oninput = function(ev) {

  let content = this.value;

  document.getElementById("get-data-mark").innerHTML = marked(content);

  let url = `https://carbon.now.sh/embed/?bg=rgba(0,0,0,0)&t=dracula&l=auto&ds=true&wc=true&wa=true&pv=15px&ph=15px&ln=false&code=`;
  
  let code = `${url}${encodeURI(content)}`;;

  document.getElementById("get-data-not-formated").innerHTML = `<a href="${code}">${code}</a>`;

  Array.from(document.querySelectorAll("pre code")).forEach(block =>
    hljs.highlightBlock(block)
  );
};

buttonGerarEmbeded.onclick = function() {
  let content = editor.value;

  let url = `https://carbon.now.sh/embed/?bg=rgba(0,0,0,0)&t=dracula&l=auto&ds=true&wc=true&wa=true&pv=15px&ph=15px&ln=false&code=`;

  let code = `${url}${encodeURI(content)}`;

  console.log(code);
};
