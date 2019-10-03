`use strict`;
// const marked = require("marked");
// const hljs = require("highlight.js");
// const remote = require("electron").remote;
// const db = require('../../src/conexao.js');
const languages = require("../assets/data/languages.js");

console.log(languages);

exports.notaTemplate = function(title, description) {
  let content = `
    <div class="card border-secondary mb-12">
    <div class="card-header">
      <h5 class="card-title float-left"><strong>${title}</strong></h5>
      <button class="float-right">
        <i class="material-icons">
          refresh
        </i>
      </button>
      <button class="float-right">
        <i class="material-icons">
          delete
        </i>
      </button>
      <button class="float-right" data-toggle="modal" data-target="#editar">
        <i class="material-icons">
          edit
        </i>
      </button>
    </div>
    <div class="card-body text-secondary">
      <h5 class="card-title">${description}</h5>
      <iframe
        src="https://carbon.now.sh/embed/?bg=rgba(0,0,0,0)&t=dracula&l=auto&ds=true&wc=true&wa=true&pv=15px&ph=15px&ln=false&code=function%20foo()%7B%0A%0A%7D"
        style="width:100%; height: 200px;border:0; overflow:hidden;margin:0px auto;" sandbox="allow-scripts allow-same-origin">
      </iframe>
    </div>
  </div><div class="dropdown-divider"></div>`;
  /*
let editor = document.getElementById("editor");

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
const buttonGerarEmbeded = document.getElementById("button-gerar-embed");

buttonGerarEmbeded.onclick = function() {
  let content = editor.value;

  let url = `https://carbon.now.sh/embed/?bg=rgba(0,0,0,0)&t=dracula&l=auto&ds=true&wc=true&wa=true&pv=15px&ph=15px&ln=false&code=`;

  let code = `${url}${encodeURI(content)}`;

  console.log(code);
};*/
  return content;
};

/**
 *
 */
exports.modalCategory = function(titulo, idModal, idButton) {
  return `
<!-- Modal Criar Categoria -->
  <div class="modal fade" id="${idModal}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
    aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">${titulo}</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <form>
            <div class="form-group">
              <label for="recipient-name" class="col-form-label">Nome da Categoria:</label>
              <input type="text" class="form-control" autofocus id="category-name">
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Fechar</button>
          <button type="button" class="btn btn-primary" id="${idButton}">Criar Categoria</button>
        </div>
      </div>
    </div>
  </div><script>

  $('#${idButton}').click(function () {

    let categoryName = $('#category-name').val().trim();

    let sql = 'INSERT INTO category(category_name) VALUES (?)';
  
    db.run(sql, [categoryName], function (err) {
      if (err) {
        return console.error(err.message);
      }
      if(this.changes > 0){
        alert("Categoria criada com sucesso!");
      }
    });
  
    // close the database connection
    db.close();
  });</script>`;
};

/**
 * Cria uma nova nota
 */
exports.modalCriarNota = function(titulo, idModal, idButton) {

  console.log(languages);
  let content = `
<!-- Modal Criar Categoria -->
<div class="modal fade bd-example-modal-lg" id="${idModal}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
<div class="modal-dialog" role="document"><!--modal-lg-->
  <div class="modal-content">
    <div class="modal-header">
      <h5 class="modal-title" id="exampleModalLabel"><strong>${titulo}</strong></h5>
      <button type="button" class="close" data-dismiss="modal" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <form>
        <div class="form-group">
          <label for="recipient-name" class="col-form-label"><strong>Título:</strong></label>
          <input type="text" class="form-control">
        </div>
        <div class="form-group">
          <label for="recipient-name" class="col-form-label"><strong>Descrição:</strong></label>
          <input type="text" class="form-control">
        </div>
        <div class="form-group">
          <label for="recipient-name" class="col-form-label"><strong>Tags:</strong></label>
          <input type="text" class="form-control">
        </div>
        <div class="form-group">
          <label for="message-text" class="col-form-label"><strong>Linguagem:</strong></label>
          <select class="custom-select mr-sm-2" id="inlineFormCustomSelect">
          <option selected>Choose...</option>
          <option value="1">One</option>
          <option value="2">Two</option>
          <option value="3">Three</option>
        </select>
        </div>
        <div class="form-group">
          <label for="message-text" class="col-form-label"><strong>Texto:</strong></label>
          <textarea class="form-control" id="editor"></textarea>
        </div>
        <div id="get-data-mark"></div>
        <div id="get-data-not-formated"></div>
        <div class="md"></div>
      </form>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" data-dismiss="modal">Fechar</button>
      <button type="button" class="btn btn-primary">Salvar nova nota</button>
    </div>
  </div>
</div>
</div>

`;
  /*
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

*/
  return content;
};
