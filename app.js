import {
  drawBLine,
  undoBLine,
  drawRect,
  undoRect,
  bCircle,
  undoBCircle,
  drawClock,
  undoClock
} from './shapes.js';
import { eraseAll } from './utils.js';

// Constants
const HEADER_HEIGHT = 150;

// Init button listeners
const currentShape = document.querySelector('.current-shape');
document.querySelectorAll('button').forEach(btn => {
  btn.addEventListener('click', e => {
    state.shape = btn.id;
    currentShape.textContent = 'Current Shape: ' + btn.id;
  });
});

// Init Canvas
const canvas = document.getElementById('canvas');
canvas.width = window.innerWidth - 2;
canvas.height = window.innerHeight - HEADER_HEIGHT - 8;

// Create exports to be used in 'shapes.js'
export const ctx = canvas.getContext('2d');
export const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
export const data = imgData.data;

// State management
const handler = {
  get: function(obj, prop) {
    return prop in obj ? obj[prop] : undefined;
  },
  set: function(obj, prop, value) {
    const prevState = { ...obj };
    obj[prop] = value;
    canvas.dispatchEvent(
      new CustomEvent('stateChange', { detail: { prevState, state: obj } })
    );
    return true;
  }
};

export const state = new Proxy(
  {
    shape: 'line',
    start: {
      x: 0,
      y: 0
    },
    end: {
      x: 0,
      y: 0
    },
    prevData: [...data],
    btnDown: false
  },
  handler
);

const clockHandler = {
  get: function(obj, prop) {
    return prop in obj ? obj[prop] : undefined;
  },
  set: function(obj, prop, value) {
    const prevState = { ...obj };
    obj[prop] = value;
    canvas.dispatchEvent(
      new CustomEvent('clockChange', { detail: { prevState, state: obj } })
    );
    return true;
  }
};

export const clockState = new Proxy(
  {
    x: 400,
    y: 400,
    r: 300,
    time: +new Date()
  },
  clockHandler
);

// Rerender on stateChange
canvas.addEventListener('stateChange', e => {
  const { detail } = e;
  const { start, end, btnDown, shape } = detail.state;
  const { prevState } = detail;

  // Handle Shape changes
  if (prevState.shape !== shape) {
    if (shape === 'erase') {
      eraseAll();
      state.prevData = [...data];
      state.shape = prevState.shape;
    }
    ctx.putImageData(imgData, 0, 0);
    // Skip rerender if shape changed
    return;
  }

  if (btnDown && prevState.end) {
    switch (shape) {
      case 'line':
        undoBLine(
          prevState.start.x,
          prevState.start.y,
          prevState.end.x,
          prevState.end.y
        );
        break;
      case 'rect':
        undoRect(
          prevState.start.x,
          prevState.start.y,
          prevState.end.x,
          prevState.end.y
        );
        break;
      case 'circle':
        undoBCircle(
          prevState.start.x,
          prevState.start.y,
          prevState.end.x,
          prevState.end.y
        );
      default:
        break;
    }
  }
  if (end) {
    switch (shape) {
      case 'line':
        drawBLine(start.x, start.y, end.x, end.y);
        break;
      case 'rect':
        drawRect(start.x, start.y, end.x, end.y);
        break;
      case 'circle':
        bCircle(start.x, start.y, end.x, end.y);
        break;
      case 'clock':
        clockState.x0 = start.x;
        clockState.y0 = start.y;
        clockState.x1 = end.x;
        clockState.y1 = end.y;
      default:
        break;
    }
  }
});

canvas.addEventListener('clockChange', e => {
  const { detail } = e;
  const { prevState } = detail;
  const { x0, y0, x1, y1, time } = detail.state;
  undoClock(
    prevState.x0,
    prevState.y0,
    prevState.x1,
    prevState.y1,
    prevState.time
  );
  drawClock(x0, y0, x1, y1, time);
});

setInterval(() => {
  if (state.shape === 'clock') clockState.time = +new Date();
}, 1000);

canvas.addEventListener('mousedown', e => {
  state.end = null;
  state.start = {
    x: e.pageX,
    y: e.pageY - HEADER_HEIGHT
  };
  state.btnDown = true;
});

canvas.addEventListener('mouseup', e => {
  state.btnDown = false;
  if (state.shape === 'clock') {
    undoClock(
      clockState.x0,
      clockState.y0,
      clockState.x1,
      clockState.y1,
      clockState.time
    );
  }
  state.prevData = [...data];
});

canvas.addEventListener('mousemove', e => {
  if (state.btnDown) {
    state.end = {
      x: e.pageX,
      y: e.pageY - HEADER_HEIGHT
    };
  }
});
