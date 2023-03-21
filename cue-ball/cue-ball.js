// cue ball simulator. see bottom for todo

//* ======= document setup ========== *//

const body = document.querySelector("body");
body.style.margin = 0;

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth - 20;
canvas.height = window.innerHeight - 50;
canvas.style.border = '2px solid black';
canvas.style.boxSizing = 'border-box';

const begin = document.getElementById('begin');
const stop = document.getElementById('stop');
const reset = document.getElementById('reset');
const data = document.getElementById('data');

begin.addEventListener('click', beginGame);
stop.addEventListener('click', stopGame);
reset.addEventListener('click', resetGame);

canvas.onmousedown = mouseDown;
canvas.onmouseup = mouseUp;
canvas.onmousemove = mouseMove;

let animation;

//* ============= variables ============= *//

// global
const friction = .99;
let dragging = false;
let dragData = {
  clickX: null,
  clickY: null,
  dx: 0,
  dy: 0,
}
// initial
const pos0 = {
  x: 100,
  y: canvas.height / 2,
  velX: 0,
  velY: 0
}

const ball = {
  ...pos0,
  elasticity: .9,
  radius: 15,
  color: 'white'
}


//* ================ listeners ================ *//
function mouseDown(e) {
  // detect if clicking within the ball.
  if (clickCollision(e.clientX, e.clientY, ball)) {
    console.log('collision');
    dragging = true;
    dragData.x = e.clientX;
    dragData.y = e.clientY;
  }

  if (!animation) animation = requestAnimationFrame(startAnimation)
  // if so, record the x and y coordinates as clickX and clickY. 
}

function mouseMove(e) {
  if (!dragging) return
  dragData.dx = e.clientX - dragData.x;
  dragData.dy = e.clientY - dragData.y;
}

function mouseUp(e) {
  // if currently dragging ball, mouseUp will update the ball's velX and velY upon release. else, do nothing
  if (!dragging) return
  // calculate difference in coordinates and record them as dx and dy
  dragData.dx = e.clientX - dragData.x;
  dragData.dy = e.clientY - dragData.y;
  ball.velX = getVel(dragData.dx);
  ball.velY = getVel(dragData.dy);
  // clear variables
  dragData.x = 0;
  dragData.y = 0;
  dragData.dx = 0;
  dragData.dy = 0;
  dragging = false;
  console.log(`dragged. dx: ${dragData.dx}; dy: ${dragData.dy}`);
  console.log(`velX: ${ball.velX}; velY: ${ball.velY}`)


  if (!animation) animation = requestAnimationFrame(startAnimation)
}


//* ================ utility ================ *//

// todo: click collision
// return true if colliding; else false
function clickCollision(x, y, ballObj) {
  if (Math.pow((x - ballObj.x), 2) <= Math.pow(ballObj.radius, 2) && Math.pow((y - ballObj.y), 2) <= Math.pow(ballObj.radius, 2)) return true;
  return false;
}

// todo: calculate velocities
function getVel(dist) {
  return - dist * .1
}

// todo: wall collision
function collide(ballObj, canv) {
  // correct out of bounds and handle bounce
  if (ballObj.x > canv.width - ballObj.radius) {
    ballObj.x === canv.width - ballObj.radius
    ballObj.velX = Math.abs(ballObj.velX) // error correction
    ballObj.velX = - ballObj.velX * ballObj.elasticity
  }
  if (ballObj.x < ballObj.radius) {
    ballObj.x === ballObj.radius
    ballObj.velX = -Math.abs(ballObj.velX)
    ballObj.velX = - ballObj.velX * ballObj.elasticity
  }
  if (ballObj.y > canv.height - ballObj.radius) {
    ballObj.y === canv.height - ballObj.radius
    ballObj.velY = -ballObj.velY * ballObj.elasticity
  }
  if (ballObj.y < ballObj.radius) {
    ballObj.y === ballObj.radius
    ballObj.velY = -Math.abs(ballObj.velY)
    ballObj.velY = -ballObj.velY * ballObj.elasticity
  }
}

// todo: drag
function applyDrag(ballObj) {
  ballObj.velX = friction * ballObj.velX;
  ballObj.velY = friction * ballObj.velY;
}

//todo: arrow
function drawArrow(context, startX, startY, endX, endY) {
  // console.log('making an arrow')
  const headlen = 10;
  var dx = endX - startX;
  var dy = endY - startY;
  var angle = Math.atan2(dy, dx);
  context.moveTo(startX, startY);
  context.lineTo(endX, endY);
  context.lineTo(endX - headlen * Math.cos(angle - Math.PI / 6), endY - headlen * Math.sin(angle - Math.PI / 6));
  context.moveTo(endX, endY);
  context.lineTo(endX - headlen * Math.cos(angle + Math.PI / 6), endY - headlen * Math.sin(angle + Math.PI / 6));
}

//* =============== animation =============== *//

function beginGame() {
  if (animation) cancelAnimationFrame(animation); // safeguard against multiple instancesd
  animation = requestAnimationFrame(startAnimation);
}

function stopGame() {
  cancelAnimationFrame(animation)
}

function resetGame() {
  ball.x = pos0.x;
  ball.y = pos0.y;
  ball.velX = pos0.velX;
  ball.velY = pos0.velY;
  dragging = false;
  cancelAnimationFrame(animation);
  render();
}

function startAnimation() {
  ball.x += ball.velX;
  ball.y += ball.velY;

  // collision
  collide(ball, canvas)

  // apply drag
  applyDrag(ball)

  //* ball animation
  // update x and y coords; x and y velocities

  // detect wall collisions

  render();
  animation = requestAnimationFrame(startAnimation)
}

function render() {
  // console.log(ball)
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = ball.color;
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI);
  ctx.fill();
  if (dragging) {
    drawArrow(ctx, ball.x, ball.y, ball.x - .5*dragData.dx, ball.y - .5*dragData.dy)
  }
  ctx.stroke();

}

render()

//TODO: 

/* 
* click and drag: detect click within ball; on drag, create arrow in opposite direction of ball

* collision: 

*/