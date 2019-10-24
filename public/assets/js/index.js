const sqlite = require("sqlite-sync"); //requiring
const $ = require("jQuery");
const {
  notas,
  modalCategory,
  modalCriarNota,
  ModalEditarNota,
  escapeHtml,
  path_db
} = require("../src/components/framework.js");

const { remote, clipboard } = require("electron");

//Caminho do Banco de Dados SQLITE3
const PATH_DB = path_db();

const win = remote.getCurrentWindow();

setTimeout(function() {
  //console.clear();
}, 500);

// Pode usar o jQuery normalmente agora.
$(document).ready(function() {
  //Abre o modal de categorias:
  $("#abrir-modal-criador-categoria").click(function() {
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
    ModalEditarNota("Editar Nota", "modalEditarNota", "btnAlterarNota")
  );

  $("#abrir-dev-tools").click(function() {
    remote.getCurrentWindow().toggleDevTools();
  });

  funcSelect2("#select-tags");

  //Modal: Evento ao abrir o modal:
  $("#modalCriarNota").on("show.bs.modal", function(event) {
    setTimeout(() => {
      $("#note-title")
        .focus()
        .select();
    }, 500);
  });

  /**
   * Criar Categoria
   */
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

  //FORMULÁRIO PARA EDITAR UMA NOTA:
  $("#form-editar-nota").submit(function(ev) {
    ev.preventDefault();

    let nota_id = document.getElementById("nota-id").value;
    let title = this.elements["gd-title"].value;
    let description = this.elements["gd-description"].value;
    let tags = this.elements["gd-tags"].value;
    let code = document.getElementById("gd-get-note");

    let category = document.getElementById("gd-gategory");
    let language = document.getElementById("gd-language");

    console.log(nota_id);
    console.log(title);
    console.log(description);
    console.log(tags);
    console.log(code.innerText);
    console.log(category[category.selectedIndex]);
    console.log(language[language.selectedIndex]);

    let sql = `UPDATE notes SET note_title =?, note_description = ?, note_code = ?,
        note_category_id = ?, note_type_language = ? WHERE  note_id = ? `;

    return false;
  });

  //CRIAR NOVA NOTA:
  $("#formSave").submit(function(ev) {
    ev.preventDefault();

    let _this = this;
    let title = this.elements.title.value;
    let description = this.elements.description.value;
    let code = this.elements.code.value;

    let category = this.elements.languages[
      this.elements.languages.selectedIndex
    ];

    let language = this.elements["formatacao-language"][
      this.elements["formatacao-language"].selectedIndex
    ];

    //Trabalhar com Tags:

    var arrInserTags = [];

    sqlite.connect(PATH_DB);

    let tags = $("#select-tags")
      .select2("data")
      .map(function(el) {
        let rows = sqlite.run(
          `SELECT tag_id, COUNT(*) AS total FROM tags WHERE tag_name = ?`,
          [el.text.toLowerCase()]
        );
        //Adicionar uma nova chave ao array
        let result = rows.map(elm => {
          elm.text = el.text.toLowerCase();
          return elm;
        });

        //Caso Já exista
        if (rows[0].total > 0) {
          arrInserTags.push(result[0]);
        } else {
          // Se não existir
          var last_insert_id = sqlite.run(
            "INSERT INTO tags (tag_name) VALUES (?)",
            [el.text.toLowerCase()]
          );
          arrInserTags.push({
            tag_id: last_insert_id,
            text: el.text.toLowerCase(),
          });
        }
        return el.text;
      });

    let sql = `INSERT INTO notes(note_title, note_description, note_code,
        note_category_id, note_type_language, created_at) VALUES (?,?,?,?,?,?);`;
    //Prepared SQL
    sqlite.run(
      sql,
      [title, description, code, category.value, language.value, Date.now()],
      function(id) {
        let _lastId = id;

        _this.reset(); //limpa o formulário

        alert("Nota criada com sucesso!"); //Cria uma nota

        carregarCategorias(); //Carrega as categoriasa

        arrInserTags.map(el => {
          sqlite.connect(PATH_DB);
          var last_insert_id = sqlite.run(
            `INSERT INTO note_tag (nt_note_fk_id, nt_tag_fk_id) VALUES (?, ?);`,
            [_lastId, el.tag_id]
          );
          console.log(last_insert_id);
        });
      }
    );

    sqlite.close();

    return false;
  });

  /**
   * Função para Buscar notas por categoria_id
   * */
  function getNotesByCategoryId(category_id) {
    sqlite.connect(PATH_DB);

    let rows = sqlite.run(
      `SELECT * FROM notes AS t1 JOIN languages AS t2
    ON t1.note_type_language = t2.lang_id WHERE note_category_id = ?
     ORDER BY t1.created_at DESC;`,
      [category_id]
    );

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

    sqlite.connect(PATH_DB);

    var rows = document.getElementById("category");

    rows.innerHTML = "";

    let result = sqlite.run(
      `SELECT note_category_id, category_id, category_name, COUNT(*) as count FROM notes as t1
      JOIN category as t2 ON t2.category_id = t1.note_category_id
      GROUP BY note_category_id`
    );

    result.map(row => {
      //INÍCIO - BUSCA CATEGORIAS
      let { category_id } = row;

      var item = document.createElement("li");

      //Ao clicar em alguma categoria:::
      item.onclick = function() {

        $(".list-group-item").removeClass(
          "list-group-item-action list-group-item-success"
        );
        $(this).addClass(
          "list-group-item-action list-group-item-success",
          "disabled"
        );
        
        $("#get-notes").html(`<lines class="line-30"></lines>
        <lines class="line-30"></lines>
        <lines class="line-30"></lines>
        <lines class="line-30"></lines>
        <lines class="line-30"></lines>
        <lines class="line-30"></lines>
        <lines class="line-30"></lines>`);

        //Busca as categorias
        let rows = getNotesByCategoryId(category_id);
        
        let content = ``;

        if (Object.keys(rows).length > 0) {
          for (let data of rows) {
            sqlite.connect(PATH_DB);

            let rows = sqlite.run(
              `SELECT tag_id, tag_name from tags AS t1 JOIN note_tag AS t2 ON t1.tag_id = t2.nt_tag_fk_id WHERE t2.nt_note_fk_id = ?`,
              [data.note_id]
            );

            content += notas(data, rows);

            sqlite.close();
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
              sqlite.connect(PATH_DB);

              sqlite.runAsync(
                "DELETE FROM notes WHERE note_id = ?;",
                [note_id],
                function(result) {
                  console.log(result);
                  carregarCategorias();
                  sqlite.close();
                }
              );
            }
          });
        });

        //Editar Nota
        $(".editar-nota").click(function() {
          var {
            note_id,
            note_title,
            note_description,
            note_tags,
            note_type_language,
          } = JSON.parse($(this).attr("data-nota"));

          $("#modalEditarNota").modal("show");

          $("#gd-title").val(note_title);

          $("#gd-description").val(note_description);

          $("#gd-tags").val(note_tags);

          var editor = ace.edit(document.getElementById(`note_${note_id}`));

          $("#gd-get-note")
            .html(escapeHtml(editor.getValue()))
            .addClass(note_type_language);

          $("#nota-id").val(note_id);

          $("pre code").each(function(i, e) {
            hljs.highlightBlock(e);
          });
        });

        //Para copiar uma nota:
        $(".copiar").each(function(index, element) {
          $(this).click(function(ev) {
            let note_id = $(this).attr("data-id");

            var editor = ace.edit(document.getElementById(`note_${note_id}`));

            //beautify.beautify(editor.session);

            var beautify = ace.require("ace/ext/beautify"); // get reference to extension
            beautify.beautify(editor.session);

            clipboard.writeText(editor.getValue());

            var options = {
              content: "Código copiado com sucesso!", // text of the snackbar
              style: "toast", // add a custom class to your snackbar
              timeout: 2000, // time in milliseconds after the snackbar autohides, 0 is disabled
            };

            $.snackbar(options);
          });
        });

        //Ace Editor
        $(".editor").each(function(i, el) {
          var _this = $(this);

          let { lang_name } = JSON.parse(_this.attr("data-note"));

          var editor = ace.edit(el);

          el.style.fontSize = "16px"; //1.5vmin

          editor.setTheme("ace/theme/dracula");

          editor.session.setMode("ace/mode/" + lang_name);

          editor.session.setTabSize(4);

          editor.resize();

          editor.setOptions({
            autoScrollEditorIntoView: true,
            copyWithEmptySelection: true,
          });
        });

        $(".open-code").click(function() {
          var _this = $(this);

          let { note_id } = JSON.parse(_this.attr("data-nota"));

          win.webContents.send("open-new-window", "ping");

          window.open("ping.html", "Título", "myWindow");
        });

        return false;
      };
      //Adiciona classes às categorias:
      $(item)
        .addClass("list-group-item justify-content-between")
        .css({ borderBottom: "1px dashed #ccc", padding: "0px !important" })
        .html(
          `${row.category_name.toUpperCase()}
   <span class='badge badge-primary badge-pill'
    style="float:right;margin:0">${row.count}</span>`
        )
        .attr("data-category", JSON.stringify(row))
        .attr("title", row.category_name.toUpperCase());

      rows.appendChild(item);

      //FIM - BUSCA CATEGORIAS
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
