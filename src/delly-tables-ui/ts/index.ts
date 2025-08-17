import { Box } from './CoreObjects/Box.js';
import { IDrawable } from './CoreObjects/IDrawable.js';
import { CanvasObjects } from './CanvasObjects/CanvasObjects.js';
import { InfiniteCanvas } from './InfiniteCanvas/InfiniteCanvas.js';

// This gets the canvas element and its context.
const canvas: HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement;
const ctx: CanvasRenderingContext2D = canvas.getContext('2d') as CanvasRenderingContext2D;


const infiniteCanvas: InfiniteCanvas = new InfiniteCanvas('canvas2', 1000, 1000);

let panDistanceX: number = 0;
let panDistanceY: number = 0;

// Pan state
let isPanning: boolean = false;

// Scaling for zoom
let scale: number = 1;

// The starting X and Y
// initial x and y coordinates when you start panning the canvas
let panStartX: number;
let panStartY: number;


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


const panDistanceXElement = document.getElementById('panDistanceX') as HTMLParagraphElement;
const panDistanceYElement = document.getElementById('panDistanceY') as HTMLParagraphElement;

const panStartXElement = document.getElementById('panStartX') as HTMLParagraphElement;
const panStartYElement = document.getElementById('panStartY') as HTMLParagraphElement;

const isPanningElement = document.getElementById('isPanning') as HTMLParagraphElement;
const scaleElement = document.getElementById('scale') as HTMLParagraphElement;

function updateValues() {
    panDistanceXElement.innerText = `panDistanceX: ${panDistanceX}`;
    panDistanceYElement.innerText = `panDistanceY: ${panDistanceY}`;
    panStartXElement.innerText = `panStartX: ${panStartX}`;
    panStartYElement.innerText = `panStartY: ${panStartY}`;
    isPanningElement.innerText = `isPanning: ${isPanning}`;
    scaleElement.innerText = `scale: ${scale}`;
}

// #region Event Listeners

// MOUSE MOVE
canvas.addEventListener("mousemove", e => {
    if (isPanning) {
        // e.OffsetX is the horizontal distance of the mouse from the left edge of the canvas 
        panDistanceX += (e.offsetX - panStartX); 
        // e.OffsetY is the veritical distance of the mouse from the top edge of the canvas 
        panDistanceY += (e.offsetY - panStartY); 
        panStartX = e.offsetX;
        panStartY = e.offsetY;
        updateValues();
        draw();
    }
});

// MOUSE DOWN ON CANVAS
canvas.addEventListener('mousedown', (e) => {
    isPanning = true;
    panStartX = e.offsetX; 
    panStartY = e.offsetY; // e.OffsetY is the veritical distance of the mouse from the top edge of the canvas 
    updateValues();
});

// MOUSE MOVE ON CANVAS
canvas.addEventListener('mousemove', (e) => {
    if (isPanning) {
        panDistanceX += (e.offsetX - panStartX);
        panDistanceY += (e.offsetY - panStartY);
        panStartX = e.offsetX;
        panStartY = e.offsetY;
        updateValues();
        draw();
    }
});

// MOUSE UP ON CANVAS
canvas.addEventListener("mouseup", () => {
    isPanning = false;
    updateValues();
});

// MOUSE LEAVE ON CANVAS
canvas.addEventListener("mouseleave", () => {
    isPanning = false;
    updateValues();
});

// MOUSE WHEEL ON CANVAS
canvas.addEventListener("wheel", e => {
    e.preventDefault();
    const zoomFactor = 1.15;
    const mouseX = e.offsetX;
    const mouseY = e.offsetY;
    const delta = e.deltaY < 0 ? zoomFactor : 1 / zoomFactor;

    const prevScale = scale;
    scale *= delta;

    panDistanceX = mouseX - (mouseX - panDistanceX) * (scale / prevScale);
    panDistanceY = mouseY - (mouseY - panDistanceY) * (scale / prevScale);
    updateValues();

    draw();
});

// When inside of the canvas, this prevents right click menu showing when right clicking
canvas.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});

// #endregion Event Listeners


function drawObjects() {
    const objects = canvasObjects.drawables;
    objects.forEach((drawable: IDrawable) => {
        drawable.draw(ctx, panDistanceX, panDistanceY);
    });
}

function draw() {
    // Reset transformation matrix 
    ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(scale, 0, 0, scale, panDistanceX, panDistanceY);

    // Draw the objects on the canvas
    drawObjects();
}

// Initial draw
draw();

// update the values seen on the UI 
updateValues();