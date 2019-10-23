`use strict`;

sqlite.connect("./src/db/notes_db.db");

let categories = sqlite.run("SELECT * FROM category;");

let languages = sqlite.run("SELECT * FROM languages ORDER BY lang_name;");

sqlite.close();

function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

exports.escapeHtml = function(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

/**
 * Mostra as notas
 */
exports.notas = function(notas, rows) {
  let { note_id, note_title, note_description, note_code, lang_name } = notas;

  let tags = "";

  if (rows.length > 0) {
    tags = rows.map(el => {
      return `<strong style="padding:5px;border-radius:25px;border:1px solid #cccc;">${el.tag_name.toUpperCase()}</strong>`;
    });
    tags = tags.join("");
  }

  let edicao = {
    note_id: note_id,
    note_title: note_title,
    note_description: note_description,
    lang_name: lang_name
  };

  let content = `<div id="note_card_${note_id}"><div class="card mb-10">
    <div class="card-header" style="border-bottom:1px solid rgba(0,0,0,0.1);padding-top:15px;padding-bottom:15px;">
      <a class="card-title" style="font-size:20px;"><strong><b>${note_title}</b></strong></a>
    </div>
    <div class="card-body text-secondary">
    <div>${tags}</div>
      <p class="card-title" style="padding-top:5px;padding-bottom:5px;">${note_description}</p>
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
      <i class="material-icons open-code" 
      title="Editar Nota"
      data-nota='${JSON.stringify(edicao)}'>
        refresh
      </i>
      <!--<pre><code contenteditable class="${lang_name}" id="note_${note_id}">${escapeHtml(
    note_code
  )}</code></pre>-->
    </div>
  </div>
  <!--ACE EDITOR-->
  <div class="row">
        <div class="col-sm-12 col-md-12">
          <div class="editor" id="note_${note_id}" data-note='${JSON.stringify(
    edicao
  )}' style="width:100%;min-height:200px;">${escapeHtml(note_code)}</div>
        </div>
  </div>
  <div class="dropdown-divider"></div></div>`;
  return content;
};

/**
 *Criar categoria <!-- Modal Criar Categoria -->
 */
exports.modalCategory = function(titulo, idModal, idButton) {
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

/**
 * Cria uma nova nota
 */
exports.modalCriarNota = function(titulo, idModal, idButton) {
  let content = `<!-- Modal Criar Nota -->
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
          <input type="text" name="title" placeholder="Título do snipper-code" id="note-title" class="form-control" required>
        </div>

        <div class="form-group">
          <label for="recipient-name" class="col-form-label"><strong>Descrição:</strong></label>
          <input type="text" name="description" placeholder="Descrição do snipper-code" class="form-control" required>
        </div>

        <div class="form-group">
          <label for="recipient-name" class="col-form-label"><strong>Tags:</strong></label>
          <select id="select-tags" multiple="multiple" style="border:1px solid red !important;width:100%;" class="form-control">
          </select>
        </div>

        <div class="row">
          <!--COLUNA 1-->
          <div class="col-sm-6 col-md-6">
          <div class="form-group">
          <label for="message-text" class="col-form-label"><strong>Categoria:</strong></label>
          <select class="custom-select mr-sm-2" name="languages">
          <option selected>Choose...</option>`;
  for (let data of categories) {
    content += `<option value="${
      data.category_id
    }">${data.category_name.toUpperCase()}</option>`;
  }
  content += `</select>
        </div>  
          </div>
          <!--COLUNA 2-->
          <div class="col-sm-6 col-md-6">
          <label for="message-text" class="col-form-label"><strong>Linguagem para Formatação:</strong></label>
          <select class="custom-select mr-sm-2" name="formatacao-language">`;
  for (let data of languages) {
    content += `<option value="${
      data.lang_id
    }">${data.lang_name.toUpperCase()}</option>`;
  }
  content += `</select>
          </div>
        </div>

        <div class="row">
          <div class="col-sm-12 col-md-12">
            <div class="form-group">
              <label for="message-text" class="col-form-label"><strong>Código:</strong></label>
              <textarea class="form-control" name="code" id="code" placeholder="Digite seu snipper-code aqui" rows=5></textarea>
            </div>
          </div>
        </div>

      </form>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" data-dismiss="modal">Fechar</button>
      <button type="submit" form="formSave" class="mdc-fab mdc-fab--extended" id="salvarNota">Salvar nova nota</button>
    </div>
  </div>
</div>
</div>
<script>
/*$("#select-tags").select2({
  createTag: function(params) {
    var term = $.trim(params.term);

    if (term === "") {
      return null;
    }

    return {
      id: term,
      text: term,
      newTag: true // add additional parameters
    };
  },
  tags: true,
  tokenSeparators: [",", " "]
});*/
</script>
`;
  return content;
};

/**
 * Modal Editar
 */

exports.ModalEditarNota = function(titulo, idModal) {
  let content = `<div class="modal fade" id="${idModal}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
<div class="modal-dialog modal-lg" role="document"><!--modal-lg-->
  <div class="modal-content">
    <div class="modal-header">
      <h5 class="modal-title" id="exampleModalLabel"><strong>${titulo}</strong></h5>
      <button type="button" class="close" data-dismiss="modal" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <form id="form-editar-nota">
        <input type="hidden" id="nota-id"/>
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

        <div class="row">
          <!--COLUNA 1-->
          <div class="col-sm-6 col-md-6">
          <div class="form-group">
          <label for="message-text" class="col-form-label"><strong>Categoria:</strong></label>
          <select class="custom-select mr-sm-2" id="gd-gategory">
          <option selected>Choose...</option>`;
  for (let data of categories) {
    content += `<option value="${
      data.category_id
    }">${data.category_name.toUpperCase()}</option>`;
  }
  content += `</select>
        </div>  
          </div>
          <!--COLUNA 2-->
          <div class="col-sm-6 col-md-6">
          <label for="message-text" class="col-form-label"><strong>Linguagem para Formatação:</strong></label>
          <select class="custom-select mr-sm-2" id="gd-language">`;
  for (let data of languages) {
    content += `<option value="${
      data.lang_id
    }">${data.lang_name.toUpperCase()}</option>`;
  }
  content += `</select>
          </div>
        </div>

        <div class="form-group">
        <pre><code id="gd-get-note" contenteditable></code></pre>
          <!--<label for="message-text" class="col-form-label"><strong>Código:</strong></label>
          <textarea class="form-control" name="code" id="code"></textarea>-->
        </div>
        <div id="get-data-mark"></div>
        <div id="get-data-not-formated"></div>
        <div class="md"></div>
      </form>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" data-dismiss="modal">Fechar</button>
      <button type="submit" form="form-editar-nota" class="mdc-fab mdc-fab--extended" id="btnEditarNota">Salvar Edição</button>
    </div>
  </div>
</div>
</div>
`;
  return content;
};
