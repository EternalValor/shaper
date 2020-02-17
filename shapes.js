import { drawPixel, undoPixel } from './utils.js';
import { ctx, imgData } from './app.js';

/**
 * Draws a line using Bresenham's Algorithm
 *
 * @param {Number} x0 - x coordinate of the beginnning point
 * @param {Number} y0 - y coordinate of the start point
 * @param {Number} x1 - x coordinate of the end point
 * @param {Number} y1 - y coordinate of the end point
 * @param {Boolen} erase - Whether or not to erase the given line
 */
export function drawBLine(x0, y0, x1, y1, erase = false) {
  console.log(erase ? 'drawing ' : 'erasing ', {
    x0,
    y0,
    x1,
    y1
  });
  let x, y;
  const dx = Math.abs(x1 - x0);
  const incX = x1 > x0 ? 1 : -1;
  const dy = Math.abs(y1 - y0);
  const incY = y1 > y0 ? 1 : -1;
  if (dx > dy) {
    let S = 2 * dy - dx;
    x = x0;
    y = y0;
    for (let i = 0; i < dx; i++) {
      if (erase) {
        undoPixel(x, y);
      } else {
        drawPixel(x, y);
      }
      x += incX;
      if (S < 0) {
        S = S + 2 * dy;
      } else {
        y = y + incY;
        S = S + 2 * dy - 2 * dx;
      }
    }
  } else {
    let S = 2 * dx - dy;
    x = x0;
    y = y0;
    for (let i = 0; i < dy; i++) {
      if (erase) {
        undoPixel(x, y);
      } else {
        drawPixel(x, y);
      }
      y += incY;
      if (S < 0) {
        S = S + 2 * dx;
      } else {
        x = x + incX;
        S = S + 2 * dx - 2 * dy;
      }
    }
  }
  ctx.putImageData(imgData, 0, 0);
}

/**
 * Undoes a line from the canvas
 *
 * @param {Number} x0 - x coordinate of the beginnning point
 * @param {Number} y0 - y coordinate of the start point
 * @param {Number} x1 - x coordinate of the end point
 * @param {Number} y1 - y coordinate of the end point
 */
export function undoBLine(x0, y0, x1, y1) {
  drawBLine(x0, y0, x1, y1, true);
}

// Line implementation using the polynomiale method
export function polyLine(x0, y0, x1, y1, erase = false) {
  const slope = (y1 - y0) / (x1 - x0);
  const b = y0 - x0 * slope;
  if (x0 < x1)
    for (let i = x0; i <= x1; i++) {
      const y = Math.floor(i * slope + b);
      if (!erase) drawPixel(i, y);
      else undoPixel(i, y);
    }
  else
    for (let i = x0; i >= x1; i--) {
      const y = Math.floor(i * slope + b);
      if (!erase) drawPixel(i, y);
      else undoPixel(i, y);
    }
  ctx.putImageData(imgData, 0, 0);
}

/**
 * Draws a rectangle onto the canvas
 *
 * @param {Number} x0 - x coordinate of the beginnning point
 * @param {Number} y0 - y coordinate of the start point
 * @param {Number} x1 - x coordinate of the end point
 * @param {Number} y1 - y coordinate of the end point
 * @param {Boolen} erase - Whether or not to erase the given rectangle
 */
export function drawRect(x0, y0, x1, y1, erase = false) {
  drawBLine(x0, y0, x1, y0, erase);
  drawBLine(x0, y0, x0, y1, erase);
  drawBLine(x1, y1, x0, y1, erase);
  drawBLine(x1, y1, x1, y0, erase);
}

/**
 * Undoes a rectangle from the canvas
 *
 * @param {Number} x0 - x coordinate of the beginnning point
 * @param {Number} y0 - y coordinate of the start point
 * @param {Number} x1 - x coordinate of the end point
 * @param {Number} y1 - y coordinate of the end point
 */
export function undoRect(x0, y0, x1, y1) {
  drawBLine(x0, y0, x1, y0, true);
  drawBLine(x0, y0, x0, y1, true);
  drawBLine(x1, y1, x0, y1, true);
  drawBLine(x1, y1, x1, y0, true);
}

/**
 * Draws a circle using Bresenham's Algorithm
 *
 * @param {Number} x0 - x coordinate of the beginnning point
 * @param {Number} y0 - y coordinate of the start point
 * @param {Number} x1 - x coordinate of the end point
 * @param {Number} y1 - y coordinate of the end point
 */
export function bCircle(x0, y0, x1, y1, erase = false) {
  console.log(erase ? 'drawing ' : 'erasing ', {
    x0,
    y0,
    x1,
    y1
  });
  const r = Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2));
  let x = 0;
  let y = Math.floor(r);
  let S = 3 - 2 * r;
  while (y > x) {
    if (!erase) {
      drawPixel(x + x0, y + y0);
      drawPixel(x + x0, -y + y0);
      drawPixel(-x + x0, y + y0);
      drawPixel(-x + x0, -y + y0);
      drawPixel(y + x0, x + y0);
      drawPixel(y + x0, -x + y0);
      drawPixel(-y + x0, x + y0);
      drawPixel(-y + x0, -x + y0);
    } else {
      undoPixel(x + x0, y + y0);
      undoPixel(x + x0, -y + y0);
      undoPixel(-x + x0, y + y0);
      undoPixel(-x + x0, -y + y0);
      undoPixel(y + x0, x + y0);
      undoPixel(y + x0, -x + y0);
      undoPixel(-y + x0, x + y0);
      undoPixel(-y + x0, -x + y0);
    }
    if (S < 0) S = S + 4 * x + 6;
    else {
      S = S + 4 * (x - y) + 10;
      y--;
    }
    x++;
  }
  ctx.putImageData(imgData, 0, 0);
}

/**
 * Undoes a Bresenham Circle
 *
 * @param {Number} x0 - x coordinate of the beginnning point
 * @param {Number} y0 - y coordinate of the start point
 * @param {Number} x1 - x coordinate of the end point
 * @param {Number} y1 - y coordinate of the end point
 */
export function undoBCircle(x0, y0, x1, y1) {
  bCircle(x0, y0, x1, y1, true);
}

/**
 * Rotate a point around pivot point
 *
 * @param {Number} pivotX - x of the pivot point
 * @param {Number} pivotY - y of the pivot point
 * @param {Number} x - x of the point to be rotated
 * @param {Number} y - y of the point to be rotated
 * @param {Number} angle - Angle of rotation in radians
 */
export function rotate(pivotX, pivotY, x, y, angle) {
  return {
    x: Math.floor(
      pivotX + (x - pivotX) * Math.cos(angle) - (y - pivotY) * Math.sin(angle)
    ),
    y: Math.floor(
      pivotY + (x - pivotX) * Math.sin(angle) + (y - pivotY) * Math.cos(angle)
    )
  };
}

/**
 * Draw a clock of a given time
 *
 * @param {Number} x0 - x of the center of the clock
 * @param {Number} y0 - y of the center of the clock
 * @param {Number} x1 - x of the edge of the clock
 * @param {Number} y1 - y of the edge of the clock
 * @param {Number} time - the time to be displayed in the clock
 * @param {Boolena} erase - whether to erase the given clock or not
 */
export function drawClock(x0, y0, x1, y1, time, erase = false) {
  const r = Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2));
  // Get current seconds, minutes, and hours positions
  const seconds = {
    length: Math.floor(r * 0.95),
    rotation: Math.floor((time / 1000) % 60) * (Math.PI / 30)
  };
  const minutes = {
    length: Math.floor(r * 0.75),
    rotation: Math.floor((time / 1000 / 60) % 60) * (Math.PI / 30)
  };
  const hours = {
    length: Math.floor(r * 0.55),
    rotation: Math.floor(
      (((time / 1000 / 60 / 60) % 12) + 1 - 12) * (Math.PI / 6)
    )
  };
  console.log('hours ', ((time / 1000 / 60 / 60) % 12) + 1 - 12);

  // Get seconds, minutes and hours end point
  let l = y0 - seconds.length;
  let { rotation } = seconds;
  const secondsPoint = rotate(x0, y0, x0, l, rotation);

  l = y0 - minutes.length;
  rotation = minutes.rotation;
  const minutesPoint = rotate(x0, y0, x0, l, rotation);

  l = y0 - hours.length;
  rotation = hours.rotation;
  const hoursPoint = rotate(x0, y0, x0, y0 - hours.length, hours.rotation);

  if (!erase) {
    bCircle(x0, y0, x1, y1);
    drawBLine(x0, y0, secondsPoint.x, secondsPoint.y);
    drawBLine(x0, y0, minutesPoint.x, minutesPoint.y);
    drawBLine(x0, y0, hoursPoint.x, hoursPoint.y);
  } else {
    undoBCircle(x0, y0, x1, y1);
    undoBLine(x0, y0, secondsPoint.x, secondsPoint.y);
    undoBLine(x0, y0, minutesPoint.x, minutesPoint.y);
    undoBLine(x0, y0, hoursPoint.x, hoursPoint.y);
  }
}

/**
 * Undoes a clock of a given time
 *
 * @param {Number} x0 - x of the center of the clock
 * @param {Number} y0 - y of the center of the clock
 * @param {Number} x1 - x of the edge of the clock
 * @param {Number} y1 - y of the edge of the clock
 * @param {Number} time - the time to be displayed in the clock
 */
export function undoClock(x0, y0, x1, y1, time) {
  drawClock(x0, y0, x1, y1, time, true);
}
