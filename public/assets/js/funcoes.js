var btnNotacao = document.getElementById("rotacao");
var btnTranslacao = document.getElementById("translacao");
var btnCisalhamento = document.getElementById("cisalhamento");
var btnLimparPlano = document.getElementById("limpar-plano");
var btnReflexaoEmY = document.getElementById("reflexao-em-y");
var btnReflexaoOrigem = document.getElementById("reflexao-origem");
var btnLimparGraficoExemplificacao = document.getElementById("limpar-grafico-exemplificacao");
var plano = document.getElementById("coordiv");
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

//Criamos esta matriz para armazenar os pontos, quando se clica no plano,
//automaticamente, é adicionado um elemento com as coordenadas x e y nesta matriz
var matriz = [];

/**
 * Plugin usado somente para visualização do
 * Configurações Iniciais do Chats
 */
var obj = {
  animationEnabled: true,
  zoomEnabled: true,
  title: {
    text: "Exemplicação usando um Plugin para mostrar no Plano",
  },
  axisX: {
    title: "X",
  },
  axisY: {
    title: "Y",
  },
  data: [
    {
      type: "scatter",
      toolTipContent: "<b>X:</b>{x}<br/><b>Y:</b>{y}",
      dataPoints: [],
    },
  ],
};

//Para se trabalhar com pontos:
//Cria-se uma matriz de letras com a função split
//Reverse é para revetir a matriz, começando assim Com a e não 'Z'
const alfabeto = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").reverse();

/**
 * Obtém as coordenadas quando passamos o mouse sobre o plano
 */
function cnvs_getCoordinates(ev) {
  let x = ev.offsetX;

  let y = ev.offsetY;

  // ev.target.title = x + "," + y;

  $("#get-coordenadas")
    .html(`[${x},${y}]`)
    .show()
    .css({ top: y, left: x + 10 });

  document.title = "Coordenadas: (" + x + "," + y + ")";
}

//Ao tirar o mouse de cima do plano, define
//os valores iniciais
function cnvs_clearCoordinates() {
  document.title = "Matrizes de Transformação Geométrica";
  $("#get-coordenadas")
    .html("")
    .hide();
}

/*Pega uma matriz de ponto, por exemplo: x e y
e multiplica por uma outra matriz e retorna uma nova
coordenada*/
function projecaoDePonto(ponto, _matriz) {
  let x = Math.round(ponto[0] * _matriz[0][0] + ponto[1] * _matriz[0][1]);

  let y = Math.round(ponto[0] * _matriz[1][0] + ponto[1] * _matriz[1][1]);

  return { x, y };
}

/**
@ponto uma matriz de coordenadas
Matriz de rotação
**/
function rotacao(ponto, angulo) {
  //A conversão é necessária,
  //pois a saída das as funções cos e sin de javascript
  //retorna o dado em radianos
  let alfa = (angulo * Math.PI) / 180;

  let matrizRotacao = [
    [Math.cos(alfa), -Math.sin(alfa)],
    [Math.sin(alfa), Math.cos(alfa)],
  ];

  return projecaoDePonto(ponto, matrizRotacao);
}

/**
 *Função para translação de ponto.
 * */
function translacao(pontoinicial, matriz) {
  let x = pontoinicial[0] + matriz[0];

  let y = pontoinicial[1] + matriz[1];

  return { x: x, y: y };
}

/**
 * Para testar no geogebra: A = {{1,2},{0,1} }
 * */
function cisalhamento(ponto, a) {
  return projecaoDePonto(ponto, [[1, a], [0, 1]]);
}

/**
 *Função para reflexão em X
 * @param {*} ponto
 */
function reflexaoEmX(ponto) {
  return projecaoDePonto(ponto, [[1, 0], [0, -1]]);
}

/**
 *Função para reflexão em Y
 * */
function reflexaoEmY(ponto) {
  return projecaoDePonto(ponto, [[-1, 0], [0, 1]]);
}

/**
 *Função para reflexão Origem
 */
function reflexaoOrigem(ponto) {
  return projecaoDePonto(ponto, [[-1, 0], [0, -1]]);
}

/**
 *Função para escalamento
 * */
function escalamento(ponto, a, b) {
  return projecaoDePonto(ponto, [[a, 0], [0, b]]);
}

//Aqui, ao clicar sobre o plano, um ponto é adicionado a ele.
document.getElementById("coordiv").onclick = function(ev) {
  //Retira o último elemento da matriz:
  let letraPonto = alfabeto.pop();

  let x = ev.offsetX;

  let y = ev.offsetY;

  let ponto = `<div style="left:${x}px;top:${y}px;" title="(${x},${y})" class="ponto-plano">
   <span class="dot"></span>
  <span class="pontos" style="display:none;z-index:9999;position:absolute;top:7px;left:-10px;"><strong>${letraPonto}</strong>(${x},${y})</span></div>`;

  let objCoord = { x: x, y: y };

  objCoord.letra = letraPonto;

  matriz.push(objCoord);

  $("#coordiv").append(ponto);

  //$('#get-pontos').append("PONTO: ").append(`${letraPonto}[${x},${y}]<br/>`);
};

let buttonCalcular = document.getElementById("calcular");

buttonCalcular.onclick = function() {
  for (let { x, y } of matriz) {
    let coord = escalamento([x, y], 5, 5);
    console.log(coord);
    obj.data[0].dataPoints.push({ x: coord.x, y: coord.y });
  }
};

//Quando soltar o mouse
buttonCalcular.onmouseup = function() {
  setTimeout(function() {
    console.log(obj);
    var chart = new CanvasJS.Chart("chartContainer", obj);
    chart.render();
  }, 1000);
};

let iniciar = false;

document.getElementById("reduzir-aumentar").oninput = function() {
  let valor = this.value;

  for (let { x, y } of matriz) {
    let data = reflexaoEmX([x, y]);

    obj.data[0].dataPoints.push({ x: data.x, y: data.y });

    /*console.log(escalamento([x, y], 3, 3));
                console.log(reflexaoEmX([x, y]));
                console.log(reflexaoEmY([x, y]));
                console.log(reflexaoOrigem([x, y]));
                console.log(efeitoCisalhamento([x, y], 2));
                ;*/
  }
};

document.getElementById("reduzir-aumentar").onmouseup = function() {
  iniciar = true;
  var chart = new CanvasJS.Chart("chartContainer", obj);
  chart.render();
};

//Para rotação:
btnNotacao.oninput = function() {
  let angulo = this.value;

  console.log(matriz);

  for (let { x, y } of matriz) {
    let coordenadas = rotacao([x, y], angulo);
    obj.data[0].dataPoints.push({ x: coordenadas.x, y: coordenadas.y });
  }
};

btnNotacao.onmouseup = function() {
  setTimeout(function() {
    var chart = new CanvasJS.Chart("chartContainer", obj);
    chart.render();
  }, 1000); //Espera-se um atraso de 1 segundo(1000 milésimo).
};

//Para translação:
btnTranslacao.onmouseup = function() {
  let angulo = this.value;
  for (let { x, y } of matriz) {
    console.log(x, y);
    let coordenadas = translacao([x, y], [parseInt(angulo), parseInt(angulo)]);
    obj.data[0].dataPoints.push({ x: coordenadas.x, y: coordenadas.y });
  }

  setTimeout(function() {
    var chart = new CanvasJS.Chart("chartContainer", obj);
    chart.render();
  }, 1000); //Espera-se um atraso de 1 segundo(1000 milésimo).
};

//btnCisalhamento:
btnCisalhamento.onmouseup = function() {
  let valor = this.value;

  for (let { x, y } of matriz) {
    let coordenadas = cisalhamento([x, y], parseInt(valor));
    obj.data[0].dataPoints.push({ x: coordenadas.x, y: coordenadas.y });
  }

  console.log(obj.data[0].dataPoints);
};

/**
 * Limpas todas as informações.
 */
var resetCanvas = function() {
  $("#chartContainer").remove(); // this is my <canvas> element
  $("#graph-container").prepend(
    '<div id="chartContainer" style="height: 370px; width: 100%;"></div>'
  );
  obj.data[0].dataPoints = [];
};

$("#limpar-plano").click(function() {
  $(".ponto-plano").remove();
  matriz = [];
  resetCanvas();
});//<!-Fim


$(btnLimparGraficoExemplificacao).click(function(){
  resetCanvas();
})

$("#reflexao-em-y").click(function() {
  for (let { x, y } of matriz) {
    let coordenadas = reflexaoEmY([x, y]);

    obj.data[0].dataPoints.push({ x: coordenadas.x, y: coordenadas.y });
  }

  setTimeout(function() {
    var chart = new CanvasJS.Chart("chartContainer", obj);
    chart.render();
  }, 500);
});

$(btnReflexaoOrigem).click(function() {
  for (let { x, y } of matriz) {
    let coordenadas = reflexaoEmY([x, y]);

    obj.data[0].dataPoints.push({ x: coordenadas.x, y: coordenadas.y });
  }

  setTimeout(function() {
    var chart = new CanvasJS.Chart("chartContainer", obj);
    chart.render();
  }, 500);
});

//Aqui, definimos o tamanho do canvas igual ao tamanho do plano
canvas.width = $(plano).width();
canvas.height = $(plano).height();

function criarPlanoCartesiano() {
  for (let k = 0; k <= canvas.width; k += 20) {
    let t = k * 2;
    ctx.beginPath();
    ctx.moveTo(0, t);
    ctx.lineTo(canvas.width, t);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(t, 0);
    ctx.lineTo(t, canvas.width);
    ctx.strokeStyle = "black";
    ctx.stroke();
    ctx.fill();
  }
}

criarPlanoCartesiano();

//MOSTRAR E ESCONDER PONTOS NO PLANO
let mostrarPontos = false;

$("#mostrar-pontos").click(function() {
  if (!mostrarPontos) {
    mostrarPontos = true;
    $(".pontos").show();
    $(this).html("ESCONDER PONTOS");
  } else {
    mostrarPontos = false;
    $(".pontos").hide();
    $(this).html("MOSTRAR TEXTO DOS PONTOS");
  }
});
