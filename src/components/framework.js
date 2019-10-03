`use strict`;
// const marked = require("marked");
// const hljs = require("highlight.js");
// const remote = require("electron").remote;
// const db = require('../../src/conexao.js');

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
  src="https://carbon.now.sh/embed/?bg=rgba(0%25252C0%25252C0%25252C0)&t=dracula&wt=sharp&l=javascript&ds=true&dsyoff=20px&dsblur=68px&wc=true&wa=true&pv=43px&ph=57px&ln=false&fl=1&fm=Hack&fs=14px&lh=133%252525&si=false&es=4x&wm=false&code=const%2520pluckDeep%2520%253D%2520key%2520%253D%253E%2520obj%2520%253D%253E%2520key.split('.').reduce((accum%252C%2520key)%2520%253D%253E%2520accum%255Bkey%255D%252C%2520obj)%250A%250Aconst%2520compose%2520%253D%2520(...fns)%2520%253D%253E%2520res%2520%253D%253E%2520fns.reduce((accum%252C%2520next)%2520%253D%253E%2520next(accum)%252C%2520res)%250A%250Aconst%2520unfold%2520%253D%2520(f%252C%2520seed)%2520%253D%253E%2520%257B%250A%2520%2520const%2520go%2520%253D%2520(f%252C%2520seed%252C%2520acc)%2520%253D%253E%2520%257B%250A%2520%2520%2520%2520const%2520res%2520%253D%2520f(seed)%250A%2520%2520%2520%2520return%2520res%2520%253F%2520go(f%252C%2520res%255B1%255D%252C%2520acc.concat(%255Bres%255B0%255D%255D))%2520%253A%2520acc%250A%2520%2520%257D%250A%2520%2520return%2520go(f%252C%2520seed%252C%2520%255B%255D)%250A%2520%2520%250A%257D"
  style="width:100%; height:473px; border:0; overflow:hidden;"
  sandbox="allow-scripts allow-same-origin">
</iframe>
    </div>
  </div><div class="dropdown-divider"></div>`;
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
  let categories = [];
  //console.log(db);

    db.each(`SELECT * FROM category;`, (err, row) => {
      categories.push(row);
    });

  console.log(categories[0]);
  console.log(categories[1]);

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
  return content;
};
