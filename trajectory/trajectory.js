const resetButton = document.getElementById('reset_trajectory');
resetButton.addEventListener("click", () => {
  physics = false;
  circle.x = initX;
  circle.y = initY;
  velY = 0;
}); // eventually, reset the position, velocity, etc.

const bounceButton = document.getElementById('bounce');
bounceButton.addEventListener("click", () => {
  physics = true;
  animate();
});

//* ======== setup ===========
const body = document.getElementById('body');
body.style.margin = 0;

const canvas = document.getElementById("trajectory");
const context = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight / 2;

offsetX = canvas.offsetLeft;
offsetY = canvas.offsetTop;

canvas.style.border = "2px solid blue";
canvas.style.boxSizing = "border-box";


//* ========= variables =========
let clickStartX;
let clickStartY;

let initX = 100;
let initY = 400;
const circle = { x: initX, y: initY, radius: 10, color: 'blue' };

const acc = 0.01;
let velX = 0;
let velY = -100;

let dragging = false;
let physics = false;



// make a circle, position it in the canvas

// sense mouse click collision with circle

// drag and release circle


// calculate position and velocity for each tick

//* ======== utility functions ==========

const adjustX = x => x - offsetX;
const adjustY = y => y - offsetY;

function mouseColliding(x, y, circle) {
  if (Math.pow((x - circle.x), 2) + Math.pow((y - circle.y), 2) <= Math.pow(circle.radius, 2)) {
    console.log('collide');
    return true
  }
  return false
}

//* ========= event listeners =========

function mouseDown(e) {
  e.preventDefault();
  // console.log('mouse down', adjustX(e.clientX), adjustY(e.clientY));

  clickStartX = e.clientX;
  clickStartY = e.clientY;

  // detect collision
  if (mouseColliding(e.clientX, e.clientY, circle)) {
    dragging = true;
  }
}

function mouseUp(e) {
  e.preventDefault();
  // console.log('mouse up');
  dragging = false;
  physics = true;
}

function mouseMove(e) {
  e.preventDefault();
  if (dragging) {
    // console.log('mouse move');

    let dx = e.clientX - clickStartX;
    let dy = e.clientY - clickStartY;

    circle.x += dx;
    circle.y += dy;

    render();

    clickStartX = e.clientX;
    clickStartY = e.clientY;
  }

}

function mouseOut(e) {
  e.preventDefault();
  dragging = false;
}

canvas.onmousedown = mouseDown;
canvas.onmouseup = mouseUp;
canvas.onmousemove = mouseMove;
canvas.onmouseout = mouseOut;


// render

function render() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = circle.color;
  context.beginPath();
  context.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI);
  context.stroke();
  context.fill();
}

render();

function tick() {
  circle.x += velX;
  circle.y += velY;
  velY += acc;
  console.log({ x: circle.x, y: circle.y, vel: velY });
  render();
}

function animate() {
  if (physics) {
    // console.log("animating")
    tick();
    requestAnimationFrame(animate());
  }
}
console.log(context);
