//* ====== doc setup ====== *//

const body = document.querySelector("body");
body.style.margin = 0;

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const begin = document.getElementById('begin');
begin.addEventListener('click', beginGame)

const stop = document.getElementById('stop');
stop.addEventListener('click', stopGame)

const reset = document.getElementById('reset');
reset.addEventListener('click', resetGame);

const data = document.getElementById('data');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight - 50;
canvas.style.border = "2px solid black";
canvas.style.boxSizing = 'border-box';

window.addEventListener('keydown', handleKeyDown);
window.addEventListener('keyup', handleKeyUp)

//* ========= variables ========== *//

let animation;

// global
const g = .2;

const character = {
  height: 30,
  width: 10,
  x: canvas.width / 2,
  y: 0,
  velY: 0,
  velX: 0
}

character.y = canvas.height - character.height

data.innerHTML = `x: ${character.x}; y: ${character.y}; velY: ${character.velY}; velX: ${character.velX}`

//* ============= keyboard inputs =========== *//
// a, d, space
function handleKeyDown(e) {
  // console.log(e);
  switch (e.key) {
    case 'a':
      character.velX = -1
      break;
    case 'd':
      character.velX = 1
      break;
    case ' ':
      if (e.repeat) return;
      character.velY = -5;
      break;
    default:
      return
  }
}

function handleKeyUp(e) {
  switch (e.key) {
    case 'a':
      character.velX = 0;
      break;
    case 'd':
      character.velX = 0;
      break;
    default:
      return;
  }
}

//* =========== utility functions =========== *//

function collideY(char, canv) {
  if (char.y >= canv.height - char.height) {
    char.y = canv.height - char.height;
    char.velY = -char.velY;
  }
  if (char.y <= 0) {
    char.y = 0;
    char.velY = -char.velY;
  }
}

function collideX(char, canv) {
  if (char.x >= canv.width - char.width) {
    char.x = canv.width - char.width;
  }
  if (char.x <= 0) {
    char.x = 0;
  }
}


//* ========= animate =========== *//

function beginGame() {
  animation = requestAnimationFrame(startAnimation);
}

function stopGame() {
  cancelAnimationFrame(animation)
}

function resetGame(){
  cancelAnimationFrame(animation);
  character.x=canvas.width/2;
  character.y = canvas.height - character.height;
  character.velX = 0;
  character.velY = 0;
  render();
}

function startAnimation() {

  character.x += character.velX;
  character.y += character.velY;
  character.y += g;



  render()
  animation = requestAnimationFrame(startAnimation);
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'green'
  ctx.fillRect(character.x, character.y, character.width, character.height);
}

render();
console.log(ctx);