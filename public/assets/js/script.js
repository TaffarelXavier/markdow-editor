var canvas = document.getElementById("canvas");

var ctx = canvas.getContext("2d");

//Espelho em X

function obterCoordenadas(ponto, tipo) {
  if (tipo == true) {

    //let espMY = [[-1, 0], [0, 1]];
    let espMX = [[1, 0], [0, -1]];

    let x = ponto[0] * espMX[0][0] + ponto[1] * espMX[0][1];

    let y = ponto[0] * espMX[1][0] + ponto[1] * espMX[1][1];
    return { x, y };
  }

  return { x: ponto[0], y: ponto[1] };
}

//Ponto A
let AX = 200;
let AY = 200;

//Ponto B
let BX = 280;
let BY = 200;

//Ponto C
let CX = 200;
let CY = 140;

setInterval(function() {
  // console.clear();
  //niciarConfiguracoesIniciais();
}, 100);

function iniciarConfiguracoesIniciais() {
  let r = BX - AX;
  let h = AY - CY;
  let g = r + h;
  let PI = Math.PI;

  /*
  console.log(r);
  console.log(h);
  console.log(PI * (r ^ 2));
*/
  ctx.beginPath();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  criarPlanoCartesiano();
  //   ctx.beginPath();

  /*AX += Math.PI / Math.sqrt(95);
  AY += Math.PI / Math.sin(95);*/

  //   ctx.font = "12px Arial";
  //   ctx.fillStyle = "red";
  //   ctx.strokeText("A", 5, 15);
  var gradient;
  for (let k = 1; k > 0; k -= 1) {
    for (var i = 0; i < 6; i++) {
      for (var j = 0; j < 6; j++) {
        ctx.fillStyle =
          "rgb(" +
          Math.floor(255 - 42.5 * i) +
          "," +
          Math.floor(255 - 42.5 * j) +
          ",0)";

        gradient = ctx.createLinearGradient(0, 0, 1000, 0);
        gradient.addColorStop("0.", " red");
        gradient.addColorStop("0.5", "blue");
        gradient.addColorStop(".5", "green");
      }
    }
    //
  }

  // Fill with gradient

  ctx.font = "12px Arial";
  ctx.fillStyle = gradient;
  ctx.strokeText("A", AX - 15, AY + 10);
  ctx.strokeText("B", BX + 5, BY + 5);
  ctx.strokeText("C", CX - 10, CY - 5);
  //ctx.strokeText("X", canvas.width - 10, canvas.height/2);
  //ctx.strokeText("Y", 5, 15);
  /*
  const VALUE = PI;

  var rad = Math.PI / 90;
  let xxx = Math.cos(rad);

  AX += xxx;
  AY -= 1;
  CX -= Math.sin(PI / 180);
  CY -= Math.cos(PI / 45);
*/
  /*
  BX *= VALUE;
  BY *= VALUE;*/

  //ctx.lineTo(BX, BY - 100);

  let pA = obterCoordenadas([AX, AY], true);
  let pB = obterCoordenadas([BX, BY], true);
  let pC = obterCoordenadas([CX, CY], true);

  ctx.moveTo(pC.x, pC.y);
  ctx.lineTo(pA.x, pA.y);
  ctx.lineTo(pB.x, pB.y);

  ctx.closePath();
  //ctx.strokeStyle = "red";
  ctx.stroke();
  ctx.fill();
}

iniciarConfiguracoesIniciais();
// criarPlanoCartesiano();
// document.getElementById("iniciar").onclick = function() {
//   iniciarConfiguracoesIniciais();
// };

let isReflexo = false;

// document.getElementById("reflexo").onclick = function() {
//   console.log(x);
//   console.log(y);
//   ctx.beginPath();
//   ctx.clearRect(0, 0, 400, 400);
//   //criarPlanoCartesiano();
//   ctx.beginPath();
//   if (!isReflexo) {
//     isReflexo = true;
//     ctx.moveTo(x, y + 200);
//   } else {
//     isReflexo = false;
//     ctx.moveTo(x, 0);
//   }
//   // ctx.strokeStyle = "red";
//   ctx.lineTo(0, 100);
//   ctx.lineTo(width, 100);
//   ctx.closePath();
//   ctx.stroke();
//   ctx.fill();
// };

// document.getElementById("aumentar").onclick = function() {
//   ctx.beginPath();
//   ctx.clearRect(0, 0, canvas.width, canvas.height);
//   criarPlanoCartesiano();
//   ctx.beginPath();
//   ctx.moveTo(x, y);
//   ctx.lineTo(0, 100);
//   width += 10;
//   ctx.lineTo(width, 100);
//   ctx.closePath();
//   ctx.strokeStyle = "red";
//   ctx.stroke();
// };

// document.getElementById("diminuir").onclick = function() {
//   ctx.beginPath();

//   ctx.clearRect(0, 0, canvas.width, canvas.height);
//   criarPlanoCartesiano();
//   ctx.beginPath();
//   ctx.moveTo(x, y);

//   ctx.lineTo(0, 100);
//   width -= 10;
//   ctx.lineTo(width, 100);
//   ctx.closePath();
//   ctx.strokeStyle = "red";
//   ctx.stroke();
// };

/**
 * Cria o plano catesiano:
 * */
function criarPlanoCartesiano() {
  for (let k = 0; k <= canvas.width; k += 10) {
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

/*      document.getElementById("criarTriangulo").onclick = function () {
          let pA = prompt("Digite o ponto A (x,y)");
          console.log(pA.split(","));
          let pB = prompt("Digite o ponto B (x,y)");
          console.log(pB.split(","));
          let pC = prompt("Digite o ponto C (x,y)");
          console.log(pC.split(","));
      }
*/

/*var canvas = document.getElementById("canvas");
        var ctx = canvas.getContext("2d");
        var cw = canvas.width;
        var ch = canvas.height;

        var sideCount = 3;
        var size = 40;
        var centerX = 50;
        var centerY = 50;
        var strokeWidth = 4;
        var strokeColor = 'purple';
        var fillColor = 'skBYlue';
        var rotationDegrees = 0;
        var rotationIncrement = 1;
        var nextTime = 0;
        var delay = 1000 / 60 * 1;

        requestAnimationFrame(animate);

        function animate(time) {
            if (time < nextTime) { requestAnimationFrame(animate); return; }
            nextTime = time + delay;
            ctx.clearRect(0, 0, cw, ch);
            drawPolygon(centerX, centerY, sideCount, size, strokeWidth, strokeColor, fillColor, rotationDegrees);
            rotationDegrees += rotationIncrement;
            requestAnimationFrame(animate);
        }

        function drawPolygon(centerX, centerY, sideCount, size, strokeWidth, strokeColor, fillColor, rotationDegrees) {
            var radians = rotationDegrees * Math.PI / 180;
            ctx.translate(centerX, centerY);
            //ctx.rotate(radians);
            ctx.beginPath();
           // ctx.moveTo(size * Math.cos(0), size * Math.sin(0));
            for (var i = 1; i <= sideCount; i += 1) {
                ctx.lineTo(size * Math.cos(i * 2 * Math.PI / sideCount), size * Math.sin(i * 2 * Math.PI / sideCount));
            }
            ctx.closePath();
            ctx.fillStyle = fillColor;
            ctx.strokeStyle = strokeColor;
            ctx.lineWidth = strokeWidth;
            ctx.stroke();
            ctx.fill();
            ctx.rotate(-radians);
            ctx.translate(-centerX, -centerY);
        }
*/
//fu
