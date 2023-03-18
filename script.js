const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

canvas.style.border = "5px solid red";
canvas.style.boxSizing = "border-box";

let canvas_width = canvas.width;
let canvas_height = canvas.height;

const shapes = [];

shapes.push({ index: 1, x: 100, y: 50, color: 'red', height: 200, width: 300 }, { index: 2, x: 20, y: 200, color: 'blue', height: 200, width: 300 })

let dragging = false;
let draggingId = null;
let startX; 
let startY;

function detectMouseCollision(x, y, shape) {
  if (shape.x <= x && x <= shape.x + shape.width && shape.y <= y && y <= shape.y + shape.height) return true;
  return false;
}

function mouseDown(event) {
  event.preventDefault();
  // console.log('mouse down');

  startX = parseInt(event.clientX);
  startY = parseInt(event.clientY);

  for (let shape of shapes) {
    if (detectMouseCollision(startX, startY, shape)) {
      // console.log(`collision at shape ${shape.index}`);
      dragging = true;
      draggingId = shape.index;
    }
  }
}

function mouseMove(event){
  if (dragging) {
    event.preventDefault();
    const activeShape = shapes.filter(shape=>shape.index === draggingId)[0];

    // calculate the change in x and y coordinates
    let dx = event.clientX - startX;
    let dy = event.clientY - startY;

    // apply changes to the active shape
    activeShape.x += dx;
    activeShape.y += dy;

    // redraw shapes
    drawShapes();

    // reset the start coordinates
    startX = event.clientX;
    startY = event.clientY;
  }
}

function mouseUp(event) {
  event.preventDefault();
  // console.log('mouse up');
  dragging = false;
}

function mouseOut(event) {
  event.preventDefault();
  dragging = false;
}

// canvas has a ton of event listeners available, null by default. we can assign functions to them.
canvas.onmousedown = mouseDown;
canvas.onmouseup = mouseUp;
canvas.onmouseout = mouseOut;
canvas.onmousemove = mouseMove;

function drawShapes() {
  context.clearRect(0, 0, canvas_width, canvas_height);
  for (let shape of shapes) {
    context.fillStyle = shape.color;
    context.fillRect(shape.x, shape.y, shape.width, shape.height)
  }
}

drawShapes();
console.log(context)