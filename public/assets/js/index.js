const sqlite = require("sqlite-sync"); //requiring
const $ = require("jQuery");
const db = require("../src/conexao.js");
const {
  notas,
  modalCategory,
  modalCriarNota,
  ModalEditarNota,
  escapeHtml,
  modalExcluirNota,
} = require("../src/components/framework.js");
const { remote, clipboard} = require("electron");
const win = remote.getCurrentWindow();

// Pode usar o jQuery normalmente agora.
$(document).ready(function() {
  //Abre o modal de categorias:
  $("#abrir-modal-criador-categoria").click(function() {
    alert("A");
    setTimeout(function() {
      $("#category-name")
        .focus()
        .select();
    }, 500);
  });

  /**
    Pesquisar Categorias:
    */
  $("#categoria").keyup(function() {

    let _value = $(this);

    _value = _value.val();

    let categories = document.getElementById("category").childNodes;

    for (let k = 0; k < categories.length; k++) {
      if (categories[k].title.toLowerCase().includes(_value.toLowerCase())) {
        $(categories[k])
          .removeAttr("hidden")
          .show();
      } else {
        $(categories[k])
          .removeClass("d-flex")
          .attr("hidden", true)
          .hide();
      }
    }
  });
  /**
   * Adiciona os modais:
   * */

  $("body").append(
    modalCategory("Criar nova categoria", "exampleModal", "idButton1"),
    modalCriarNota("Criar nova nota", "modalCriarNota", "buttonCriarNota"),
    ModalEditarNota("Editar Nota", "modalEditarNota", "btnAlterarNota"),
    modalExcluirNota()
  );

  //$("#modallll").modal("show");

  $("#abrir-dev-tools").click(function() {
    remote.getCurrentWindow().toggleDevTools();
  });

  //Evento ao abrir o modal:
  $("#modalCriarNota").on("show.bs.modal", function(event) {
    setTimeout(() => {
      $("#note-title")
        .focus()
        .select()
        .val("");
    }, 500);
  });

  $("#exampleModal").on("show.bs.modal", function(event) {});

  $("#idButton1").click(function() {
    let categoryName = $("#category-name")
      .val()
      .trim();
    if (categoryName != "") {
      let sql = "INSERT INTO category(category_name) VALUES (?)";

      db.run(sql, [categoryName], function(err) {
        if (err) {
          return console.error(err.message);
        }

        let lastId = this.lastID;

        if (this.changes > 0) {
          alert("Categoria criada com sucesso!");
          var languages = document.getElementsByName("languages");
          $(languages).append(
            `<option value='${lastId}'>${categoryName}</option>`
          );
        }
      });
    }
  });

  $("#formSave").submit(function(ev) {
    ev.preventDefault();

    let title = this.elements.title.value;
    let description = this.elements.description.value;
    let tags = this.elements.tags.value;
    let code = this.elements.code.value;

    let languages = document.getElementsByName("languages");
    let language = $(languages).val();

    let data = this.elements.languages[this.elements.languages.selectedIndex];

    let sql = `INSERT INTO notes(note_title, note_description, note_code,
        note_category_id, note_type_language, created_at) VALUES (?,?,?,?,?,?);`;

    db.run(
      sql,
      [title, description, code, data.value, data.label, Date.now()],
      function(err) {
        if (err) {
          return console.error(err.message);
        }
        if (this.changes > 0) {
          alert("Nota criada com sucesso!");
          carregarCategorias();
        }
      }
    );
    return false;
  });
  /**
   * Função para Buscar notas por categoria_id
   * */
  function getNotesByCategoryId(category_id) {
    
    sqlite.connect("./src/db/notes_db.db");

    let rows = sqlite.run(`SELECT * FROM notes AS t1 JOIN languages AS t2
    ON t1.note_type_language = t2.lang_id WHERE note_category_id = ? ;`, [
      category_id,
    ]);

    sqlite.close();

    return rows;
  }

  var options = {
    content: "Some text", // text of the snackbar
    style: "toast", // add a custom class to your snackbar
    timeout: 1000, // time in milliseconds after the snackbar autohides, 0 is disabled
  };

  $.snackbar(options);

  function carregarCategorias() {
    db.serialize(() => {
      var rows = document.getElementById("category");

      rows.innerHTML = "";

      db.each(
        `SELECT note_category_id, category_id, category_name, COUNT(*) as count FROM notes as t1
    JOIN category as t2 ON t2.category_id = t1.note_category_id
    GROUP BY note_category_id`,
        (err, row) => {
          if (err) {
            console.error(err.message);
          }

          var item = document.createElement("li");

          item.onclick = function() {
            //Busca as categorias
            let rows = getNotesByCategoryId(row.category_id);

            let content = "";

            if (Object.keys(rows).length > 0) {
              for (let data of rows) {
                content += notas(data);
              }
            }

            $("#get-notes").html(content);

            //Exluir nota:
            $(".excluir-nota").click(function() {
              let note_id = parseInt($(this).attr("data-nota-id"));
              
              let options = {
                type: "question",
                buttons: ["Não", "Sim"],
                title: "Deseja realmente excluir esta nota?",
                message: "Esta operação não poderá ser revertida.",
                detail: "Algum detalhe aqui",
                defaultId: 0,
                cancelId: -1,
              };

              remote.dialog.showMessageBox(win, options, response => {
                if (response == 1) {
                  $(`#note_card_${note_id}`).remove();
                  // delete a row based on id
                  db.run(
                    `DELETE FROM notes WHERE note_id = ?`,
                    note_id,
                    function(err) {
                      if (err) {
                        alert(JSON.stringify(err.message));
                        return false;
                      }
                      console.log(`Row(s) deleted ${this.changes}`);
                      carregarCategorias();
                    }
                  );
                }
              });
            
            });

            //Editar Nota
            $(".editar-nota").click(function() {

              var nota = JSON.parse($(this).attr("data-nota"));

              $("#modalEditarNota").modal("show");

              $("#gd-title").val(nota.note_title);

              $("#gd-description").val(nota.note_description);

              $("#gd-tags").val(nota.note_tags);

              $("#gd-get-note")
                .html(escapeHtml($(`#note_${nota.note_id}`).text()))
                .addClass(nota.note_type_language);

              $("#nota-id").val(nota.note_id);

              $("pre code").each(function(i, e) {
                hljs.highlightBlock(e);
              });
            });

            //Para copiar uma nota:
            $(".copiar").each(function(index, element) {
              $(this).click(function(ev) {
                let note_id = $(this).attr("data-id");

                clipboard.writeText($(`#note_${note_id}`).text());

                var options = {
                  content: "Código copiado com sucesso!", // text of the snackbar
                  style: "toast", // add a custom class to your snackbar
                  timeout: 2000, // time in milliseconds after the snackbar autohides, 0 is disabled
                };

                $.snackbar(options);
              });
            });

            // hljs.initHighlighting.called = false;
            // hljs.initHighlighting();
            $("pre code").each(function(i, e) {
              hljs.highlightBlock(e);
            });
            return false;
          };

          $(item)
            .addClass(
              "list-group-item d-flex justify-content-between align-items-center"
            )
            .html(
              row.category_name.toUpperCase() +
                ` <span class='badge badge-primary badge-pill'>${row.count}</span>`
            )
            .attr("data-category", JSON.stringify(row))
            .attr("title", row.category_name.toUpperCase());

          rows.appendChild(item);
        }
      );
    });
  }

  carregarCategorias();
}); //Fim: $(document).ready

//Fecha a janela do windows:
const close = e => {
  const window = remote.getCurrentWindow();
  window.close();
};

document.querySelector("#close-this-window").addEventListener("click", close);
