`use strict`;

function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

exports.escapeHtml = function(unsafe){
  return unsafe
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;")
  .replace(/'/g, "&#039;"); 
}

/**
 * Mostra as notas
 */
exports.notas = function (notas) {

  let { note_id, note_title, note_description, note_code, note_type_language } = notas;

  let edicao = {
    note_id: note_id,
    note_title: note_title,
    note_description: note_description,
    note_type_language: note_type_language
  };

  let content = `
    <div id="note_card_${note_id}"><div class="card mb-10">
    <div class="card-header" style="border-bottom:1px solid rgba(0,0,0,0.1);padding-top:0;padding-bottom:0;">
      <a class="card-title" style="font-size:20px;"><strong><b>${note_title}</b></strong></a>
    </div>
    <div class="card-body text-secondary">
      <p class="card-title">${note_description}</p>

      <i class="material-icons copiar" data-id="${note_id}"
      title="Copiar código"
      id="copiar_${note_id}" title="Clique para copiar">file_copy</i>

      <i class="material-icons excluir-nota"
      title="Excluir nota"
      data-nota-id="${note_id}">
        delete
      </i>
      <i class="material-icons editar-nota" 
      title="Editar Nota"
      data-nota='${JSON.stringify(edicao)}'>
        edit
      </i>
      <pre><code contenteditable class="${note_type_language}" id="note_${note_id}">${escapeHtml(note_code)}</code></pre>
    </div>
  </div>
  <div class="dropdown-divider"></div></div>`;
  return content;
};

/**
 *Criar categoria <!-- Modal Criar Categoria -->
 */
exports.modalCategory = function (titulo, idModal, idButton) {
  return `
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
  </div>`;
};

exports.modalExcluirNota = function (titulo, idModal, idButton) {
  return `
  <div class="modal" tabindex="-1" role="dialog" id="modallll">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Excluir Nota</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <p>Modal body text goes here.</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-primary">Save changes</button>
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>`;
};

/**
 * Cria uma nova nota
 */
exports.modalCriarNota = function (titulo, idModal, idButton) {
  sqlite.connect("./src/db/notes_db.db");
  let categories = sqlite.run("SELECT * FROM category;");
  sqlite.close();
  let content = `<!-- Modal Criar Categoria -->
<div class="modal fade bd-example-modal-lg" id="${idModal}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
<div class="modal-dialog modal-lg" role="document"><!--modal-lg-->
  <div class="modal-content">
    <div class="modal-header">
      <h5 class="modal-title" id="exampleModalLabel"><strong>${titulo}</strong></h5>
      <button type="button" class="close" data-dismiss="modal" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <form id="formSave">
        <div class="form-group">
          <label for="recipient-name" class="col-form-label"><strong>Título:</strong></label>
          <input type="text" name="title" class="form-control" required>
        </div>
        <div class="form-group">
          <label for="recipient-name" class="col-form-label"><strong>Descrição:</strong></label>
          <input type="text" name="description" class="form-control" required>
        </div>
        <div class="form-group">
          <label for="recipient-name" class="col-form-label"><strong>Tags:</strong></label>
          <input type="text" name="tags" class="form-control" required>
        </div>
        <div class="form-group">
          <label for="message-text" class="col-form-label"><strong>Linguagem:</strong></label>
          <select class="custom-select mr-sm-2" name="languages">
          <option selected>Choose...</option>`;

  for (let data of categories) {
    content += `<option value="${data.category_id}">${data.category_name}</option>`;
  }

  content += `</select>
        </div>
        <div class="form-group">
          <label for="message-text" class="col-form-label"><strong>Código:</strong></label>
          <textarea class="form-control" name="code" id="code"></textarea>
        </div>
        <div id="get-data-mark"></div>
        <div id="get-data-not-formated"></div>
        <div class="md"></div>
      </form>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" data-dismiss="modal">Fechar</button>
      <button type="submit" form="formSave" class="mdc-fab mdc-fab--extended" id="salvarNota">Salvar nova nota</button>
    </div>
  </div>
</div>
</div>`;
  return content;
};

/**
 * Modal Editar
 */

exports.ModalEditarNota = function (titulo, idModal) {

  sqlite.connect("./src/db/notes_db.db");

  let categories = sqlite.run("SELECT * FROM category;");

  sqlite.close();

  let content = `
<div class="modal fade" id="${idModal}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
<div class="modal-dialog modal-lg" role="document"><!--modal-lg-->
  <div class="modal-content">
    <div class="modal-header">
      <h5 class="modal-title" id="exampleModalLabel"><strong>${titulo}</strong></h5>
      <button type="button" class="close" data-dismiss="modal" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <form id="formSave">
        <input type="text" id="nota-id" value="aaa"/>
        <div class="form-group">
          <label for="recipient-name" class="col-form-label"><strong>Título:</strong></label>
          <input type="text" id="gd-title" class="form-control" required>
        </div>
        <div class="form-group">
          <label for="recipient-name" class="col-form-label"><strong>Descrição:</strong></label>
          <input type="text"  id="gd-description" class="form-control" required>
        </div>
        <div class="form-group">
          <label for="recipient-name" class="col-form-label"><strong>Tags:</strong></label>
          <input type="text" id="gd-tags" class="form-control" required>
        </div>
        <div class="form-group">
          <label for="message-text" class="col-form-label"><strong>Linguagem:</strong></label>
          <select class="custom-select mr-sm-2" name="languages">
          <option selected>Choose...</option>`;

  for (let data of categories) {
    content += `<option value="${data.category_id}">${data.category_name}</option>`;
  }

  content += `</select>
        </div>
        <div class="form-group">
        <pre><code id="gd-get-note" contenteditable></code></pre>
          <label for="message-text" class="col-form-label"><strong>Código:</strong></label>
          <textarea class="form-control" name="code" id="code"></textarea>
        </div>
        <div id="get-data-mark"></div>
        <div id="get-data-not-formated"></div>
        <div class="md"></div>
      </form>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" data-dismiss="modal">Fechar</button>
      <button type="submit" form="formSave" class="mdc-fab mdc-fab--extended" id="salvarNota">Salvar nova nota</button>
    </div>
  </div>
</div>
</div>
`;
  return content;
};
