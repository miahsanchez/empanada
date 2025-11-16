import { DOUGH_STATES, FRY_STATES } from './states.js';

// ===== Canvas Setup =====
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let doughState = DOUGH_STATES.empty;
let fryState;

function fixBlurryCanvas(canvas, ctx) {
  const dpr = window.devicePixelRatio || 1;

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
  radius: 80,
  color: '#d5b895',
  halved: doughState === DOUGH_STATES.folded,
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

const fryer = {
  x: 600,
  y: 275,
  width: 100,
  height: 200,
  color: '#6f6f6f',
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
  drawFryer();
  drawDough();
  drawIngredients();

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
  // TOP LEFT ORIGIN!!!

  ctx.fillRect(0, 250, canvas.width, 250);
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

function drawFryerBubbles() {
  const rows = 10;
  const cols = 5;

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      // evenly space the bubbles inside the rectangle
      const x = fryer.x + (j + 0.5) * (fryer.width / cols); // +0.5 to center in cell
      const y = fryer.y + (i + 0.5) * (fryer.height / rows);

      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#ffee00';
      ctx.fill();
    }
  }
}

function drawFryer() {
  ctx.fillStyle = fryer.color;

  ctx.fillRect(fryer.x, fryer.y, fryer.width, fryer.height);

  if (fryState === FRY_STATES.frying) {
    drawFryerBubbles();
  }

  //   ctx.fillStyle = '#000';
  //   ctx.font = '14px sans-serif';
}

function drawDough() {
  const degrees = Math.PI * (dough.halved ? 1 : 2);

  ctx.beginPath();
  ctx.arc(dough.x, dough.y, dough.radius, 0, degrees, dough.halved);

  ctx.fillStyle = dough.color;
  ctx.fill();
}

function isIntersecting(ingredient) {
  const isI = Math.abs(ingredient.x - dough.x) <= 50;
  return isI;
}

let dragging = false;

function isInsideCircle(mx, my, circle) {
  const dx = mx - circle.x;
  const dy = my - circle.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  return distance <= circle.radius; // <= radius
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
    dough.halved = true;
    console.log('Dough clicked!');
  }
});

canvas.addEventListener('mousemove', (e) => {
  console.log('MOUSE MOVE');
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;
  if (dragging && selectedIngredient && doughState !== DOUGH_STATES.folded) {
    selectedIngredient.x = mouseX - selectedIngredient.width / 2;
    selectedIngredient.y = mouseY - selectedIngredient.height / 2;
  }
  if (dragging && doughState === DOUGH_STATES.folded) {
    dough.x = mouseX;
    dough.y = mouseY;
  }
});

function intersectingWithFryer(ingredient) {
  console.log('DOUGH', ingredient.x, ingredient.y);

  const top = fryer.y;
  const bottom = fryer.y + fryer.height;

  const left = fryer.x;
  const right = fryer.x + fryer.width;
  const a =
    ingredient.x <= right &&
    ingredient.x >= left &&
    ingredient.y >= top &&
    ingredient.y <= bottom;
  console.log('MIAH A IS', a);

  return a;
}

canvas.addEventListener('mouseup', (e) => {
  console.log('IN ON MOUSE UP');
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

    if (doughState === DOUGH_STATES.folded) {
      if (intersectingWithFryer(dough)) {
        dough.x = canvas.width / 2;
        dough.y = 375;
        dough.radius = 80;
        dough.halved = false;

        doughState = DOUGH_STATES.empty;
        fryState = FRY_STATES.frying;
      }
    }
  }
});
