import { DOUGH_STATES } from './states.js';

// ===== Canvas Setup =====
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let doughState = DOUGH_STATES.empty;

function fixBlurryCanvas(canvas, ctx) {
  const dpr = window.devicePixelRatio || 1;

  // Save CSS width/height
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;

  canvas.width = w * dpr;
  canvas.height = h * dpr;

  ctx.scale(dpr, dpr);
}

const pork = {
  name: 'pork',
  x: 75,
  y: 275,
  width: 80,
  height: 80,
  color: '#d46f4d',
  onClick: () => {
    console.log('Pork clicked!');
    selectedIngredient = 'pork';
  },
  shape: 'square',
};

const chicken = {
  name: 'chicken',
  x: 75,
  y: 375,
  width: 80,
  height: 80,
  color: '#ffee8c',
  //   onClick: () => {
  //     console.log('chicken clicked!');
  //     selectedIngredient = 'pork';
  //   },
  shape: 'square',
};

const dough = {
  name: 'dough',
  x: canvas.width / 2,
  y: 375,
  width: 80,
  height: 80,
  color: '#d5b895',

  shape: 'circle',
};

const dumpling = {
  name: 'dumpling',
  x: 250,
  y: 325,
  width: 0,
  height: 0,
  color: '#008000',

  shape: 'circle',
};
// fixBlurryCanvas(canvas, ctx);

// ===== Game State =====
const sources = [pork, chicken];
const ingredients = [pork, dumpling, chicken];

let selectedIngredient = null;

// ===== Game Loop =====
function update() {
  // This is where you'd update timers, cooking states, customers, etc.
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawCounter();
  drawDough();
  drawIngredients();
  drawFryer();

  drawSelectedInfo();
}

function gameLoop() {
  update();
  render();
  requestAnimationFrame(gameLoop);
}

gameLoop();

// ===== Drawing Helpers =====
function drawCounter() {
  ctx.fillStyle = '#c2a57c';
  ctx.fillRect(0, 250, canvas.width, 250);
  //   ctx.fillRect(0, 300, canvas.width, 200);
}

function drawIngredients() {
  ingredients.forEach((item) => {
    ctx.fillStyle = item.color;

    if (item.name !== 'dough') {
      ctx.fillRect(item.x, item.y, item.width, item.height);
    }

    ctx.fillStyle = '#000';
    ctx.font = '14px sans-serif';

    // ctx.fillText(item.name, item.x + 10, item.y + item.height + 15);
  });
}

function drawSelectedInfo() {
  ctx.fillStyle = '#000';
  ctx.font = '20px sans-serif';
  ctx.fillText(`${doughState}`, 20, 40);
}

function drawFryer() {
  ctx.fillStyle = '#6f6f6f';

  ctx.fillRect(600, 275, 100, 200);

  //   ctx.fillStyle = '#000';
  //   ctx.font = '14px sans-serif';
}

function drawDough() {
  const item = dough;

  ctx.beginPath();
  if (doughState === DOUGH_STATES.empty || doughState === DOUGH_STATES.filled) {
    ctx.arc(item.x, item.y, item.width, 0, Math.PI * 2); // full circle
  } else if (doughState === DOUGH_STATES.folded) {
    ctx.arc(item.x, item.y, item.width, 0, Math.PI, true); // full circle
  }
  ctx.fillStyle = item.color;
  ctx.fill();
}

function isIntersecting(ingredient) {
  const isI = Math.abs(ingredient.x - dough.x) <= 50;
  return isI;
}

// ===== Click Detection =====
// canvas.addEventListener('click', (e) => {
//   console.log('IN THE CLICK LISTENER');
//   const rect = canvas.getBoundingClientRect();
//   const mouseX = e.clientX - rect.left;
//   const mouseY = e.clientY - rect.top;

//   ingredients.forEach((item) => {
//     if (
//       mouseX >= item.x &&
//       mouseX <= item.x + item.width &&
//       mouseY >= item.y &&
//       mouseY <= item.y + item.height
//     ) {
//       item.onClick();
//     }
//   });
// });

let dragging = false;

function isInsideCircle(mx, my, circle) {
  // circle.x, circle.y = center of circle
  // circle.width = radius (or you could have circle.radius)
  const dx = mx - circle.x;
  const dy = my - circle.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  return distance <= circle.width; // <= radius
}

canvas.addEventListener('mousedown', (e) => {
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;
  dragging = true;

  sources.forEach((item) => {
    if (
      mouseX >= item.x &&
      mouseX <= item.x + item.width &&
      mouseY >= item.y &&
      mouseY <= item.y + item.height
    ) {
      const newIng = {
        ...item,
      };
      selectedIngredient = newIng;
      ingredients.push(newIng);
    }
  });

  if (
    isInsideCircle(mouseX, mouseY, dough) &&
    doughState === DOUGH_STATES.filled
  ) {
    ingredients.pop();
    doughState = DOUGH_STATES.folded;
    console.log('Dough clicked!');
  }
});

canvas.addEventListener('mousemove', (e) => {
  console.log('MOUSE MOVE');
  const rect = canvas.getBoundingClientRect();
  if (dragging && selectedIngredient) {
    // console.log('Dragging at', e.offsetX, e.offsetY);
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // console.log('SELECTED INGREDIENT', selectedIngredient);

    selectedIngredient.x = mouseX - selectedIngredient.width / 2;
    selectedIngredient.y = mouseY - selectedIngredient.height / 2;

    // TODO: update intersecting logic
    // if (isIntersecting()) {
    //   pork.width = pork.height = 0;
    //   dough.width = dough.height = 0;
    //   dumpling.width = dumpling.height = 80;
    //   dumpling.x = mouseX - selectedIngredient.width / 2;
    //   dumpling.y = mouseY - selectedIngredient.height / 2;
    // }
  }
});

canvas.addEventListener('mouseup', (e) => {
  if (dragging) {
    dragging = false;
    // console.log('Drag ended!');
    if (
      selectedIngredient &&
      isIntersecting(selectedIngredient) &&
      doughState === DOUGH_STATES.empty
    ) {
      doughState = DOUGH_STATES.filled;
      selectedIngredient = null;
    }
  }
});
