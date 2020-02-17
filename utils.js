import { state, data } from './app.js';

/**
 * Draws a pixel onto the canvas
 *
 * @param {Number} x - x coordinate of point
 * @param {Number} y - y coordinat of point
 */
export function drawPixel(x, y) {
  // Get the position of point in the data array
  const n = (y * canvas.width + x) * 4;
  // Draw a black pixel at the point
  data[n] = 0; // R
  data[n + 1] = 0; // G
  data[n + 2] = 0; // B
  data[n + 3] = 255; // Brightness
}

/**
 * Undoes a pixel from the canvas
 *
 * @param {Number} x - x coordinate of point to undo
 * @param {Number} y - y coordinate of point to undo
 */
export function undoPixel(x, y) {
  const n = (y * canvas.width + x) * 4;
  if (state.prevData[n + 3] > 0) return;
  data[n + 3] = 0;
}

/**
 * Erases everything off of the canvas
 */
export function eraseAll() {
  for (let i = 0; i < data.length; i++) data[i] = 0;
}
