//* ======= document setup ========== *//

const body = document.querySelector("body");
body.style.margin = 0;

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight - 50;

const start = document.getElementById('start');
const stop = document.getElementById('stop');
const reset = document.getElementById('reset');
const add = document.getElementById('add');

start.addEventListener("click", startAnimation);
stop.addEventListener("click", stopAnimation);
reset.addEventListener("click", resetAnimation);
add.addEventListener("click", addBall);

let animation;

//* ======= initial variables ======== *//

// global
const accY = .15;
const accX = 0;
const active = false;
const drag = .001;
const friction = .1;

// ball variables
const initX = canvas.width / 2;
const initY = 50;

const ballsInit = [
  {
    x: initX,
    y: initY,
    velX: 2,
    velY: 0,
    radius: 10,
    color: 'black',
    elasticity: .75,
    rolling: false
  },
  {
    x: initX + 200,
    y: initY + 200,
    velX: -1,
    velY: -4,
    radius: 10,
    color: 'red',
    elasticity: .75,
    rolling: false
  },
]

const balls = [...ballsInit];

//* =========== utility functions ========== *//

//TODO: collision
// colliding: true; else: false
function collideY(ball, canvas) {
  if (ball.y >= canvas.height - ball.radius || ball.y <= ball.radius) return true
  return false
}
function collideX(ball, canvas) {
  if (ball.x >= canvas.width - ball.radius || ball.x <= ball.radius) return true
  return false
}

//TODO: render
function render() {
  // console.log('render')
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let ball of balls) {
    ctx.fillStyle = ball.color;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI);
    ctx.fill();
  }
    ctx.stroke();
}

//TODO: reset
function resetAnimation() {
  console.log('reset');
  console.log('balls:', balls);
  console.log('ballsinit:', ballsInit)
  for (let i = 0; i < balls.length; i++) {
    balls[i] = ballsInit[i];
  }
  cancelAnimationFrame(animation);
  render();
}

//TODO: drag
// every tick, velocity in both x and y directions should decrement proportional to their current value
function applyDrag(ball) {
  ball.velX = (1 - drag) * ball.velX;
  ball.velY = (1 - drag) * ball.velY;
}

function applyFriction(ball) {
  ball.velX = (1 - friction) * ball.velX;
}

function makeRandom(min, max) {
  return Math.random() * (max - min) + min
}

function addBall() {

  const newBall = {
    x: makeRandom(50, canvas.width - 50),
    y: makeRandom(50, 400),
    velX: makeRandom(-10, 10),
    velY: makeRandom(-10, 10),
    radius: makeRandom(5, 20),
    color: `rgb(${makeRandom(1, 255)}, ${makeRandom(1, 255)}, ${makeRandom(1, 255)})`,
    elasticity: makeRandom(.2, .9),
    rolling: false,
  };

  console.log(newBall.color);

  balls.push(newBall);
  ballsInit.push(newBall);

  render();
}



//* ========= animate ========= *//

function startAnimation() {
  // console.log('start');
  for (let ball of balls) {
    // update position
    ball.y += ball.velY;
    ball.x += ball.velX;

    // correct for too large x/ys
    if (ball.y > canvas.height - ball.radius) ball.y = canvas.height - ball.radius;
    if (ball.y < ball.radius) ball.y = ball.radius;
    if (ball.x > canvas.width - ball.radius) ball.x = canvas.width - ball.radius;
    if (ball.x < ball.radius) ball.x = ball.radius;

    // check for Y bounce
    if (collideY(ball, canvas)) {
      ball.velY = - ball.elasticity * ball.velY;
    }
    else {
      ball.velY += accY;
    }

    // check for X bounce
    if (collideX(ball, canvas)) {
      ball.velX = - ball.elasticity * ball.velX
    }
    else {
      ball.velY += accX;
    }

    applyDrag(ball);

    // if velY very small and ball is very near the floor, it is rolling => apply friction
    if (Math.abs(ball.velY) <= .1 && Math.abs(ball.y - (canvas.height - ball.radius)) <= 1) {
      applyFriction(ball);
    }
  }

  // draw ball
  render();
  // next frame
  animation = requestAnimationFrame(startAnimation);
}

function stopAnimation() {
  console.log('stop');
  cancelAnimationFrame(animation);
}

render()