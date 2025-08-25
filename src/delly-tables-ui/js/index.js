import { Box } from './CoreObjects/Box.js';
import { CanvasObjects } from './CanvasObjects/CanvasObjects.js';
import { InfiniteCanvas } from './InfiniteCanvas/InfiniteCanvas.js';
// This gets the canvas element and its context.
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
// #region Add shapes to canvas
// Represents the running list of canvas objects to be added to and deleted
const canvasObjects = new CanvasObjects();
// Sample box to draw
const box1 = new Box(200, 100, '#5c9dffff', 100, 100);
canvasObjects.addDrawable(box1);
const box2 = new Box(200, 200, '#aa269fff', 400, 500);
canvasObjects.addDrawable(box2);
const box3 = new Box(200, 300, '#8ef7ffff', 750, 300);
canvasObjects.addDrawable(box3);
const box4 = new Box(100, 300, '#ecaf2aff', 600, -300);
canvasObjects.addDrawable(box4);
// #endregion Add shapes to canvas
const infiniteCanvas = new InfiniteCanvas('canvas', 1500, 700, canvasObjects);
