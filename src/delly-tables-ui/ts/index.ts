import { Box } from './CoreObjects/Box.js';
import { CanvasObjects } from './CanvasObjects/CanvasObjects.js';
import { InfiniteCanvas } from './InfiniteCanvas/InfiniteCanvas.js';

// This gets the canvas element and its context.
const canvas: HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement;
const ctx: CanvasRenderingContext2D = canvas.getContext('2d') as CanvasRenderingContext2D;

// #region Add shapes to canvas

// Represents the running list of canvas objects to be added to and deleted
const canvasObjects: CanvasObjects = new CanvasObjects();

// Sample box to draw
const box1: Box = new Box(200, 100, '#5c9dffff', 100, 100);
canvasObjects.addDrawable(box1);

const box2: Box = new Box(200, 200, '#aa269fff', 400, 500);
canvasObjects.addDrawable(box2);

const box3: Box = new Box(200, 300, '#8ef7ffff', 750, 300);
canvasObjects.addDrawable(box3);

const box4: Box = new Box(100, 300, '#ecaf2aff', 600, -300);
canvasObjects.addDrawable(box4);

// #endregion Add shapes to canvas

// create the canvas

// calculate the size of the width of the screen

// calulate the height of the screen

const infiniteCanvas: InfiniteCanvas = new InfiniteCanvas('canvas', 1500, 700, canvasObjects);