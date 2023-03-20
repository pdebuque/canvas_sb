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

start.addEventListener("click", startAnimation);
stop.addEventListener("click", stopAnimation);
reset.addEventListener("click", resetAnimation);

let animation;

//* ======= initial variables ======== *//

// global
const accY = .1;
const accX = 0;
const active = false;
const drag = .0001;

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
  },
  {
    x: initX + 200,
    y: initY + 200,
    velX: -1,
    velY: -4,
    radius: 10,
    color: 'red',
    elasticity: .75,
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
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let ball of balls) {
    ctx.fillStyle = ball.color;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();
  }
}

//TODO: reset
function resetAnimation() {
  for (let i=0; i<balls.length; i++) {
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
  }

  // draw ball
  render();

  animation = requestAnimationFrame(startAnimation);
}

function stopAnimation() {
  console.log('stop');
  cancelAnimationFrame(animation);
}



render()