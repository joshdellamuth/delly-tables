// js fiddle for zooming and panning https://jsfiddle.net/3gLrk2ad/

import { Box } from './CoreObjects/Box.js';
import { IDrawable } from './CoreObjects/IDrawable.js';
import { CanvasObjects } from './CanvasObjects/CanvasObjects.js';

// This gets the canvas element and its context.
const canvas: HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement;
const ctx: CanvasRenderingContext2D = canvas.getContext('2d') as CanvasRenderingContext2D;

// This is for the element that displays the x and y coordinates on the grid.
const offsetDisplay: HTMLElement = document.getElementById('offset') as HTMLElement;

// Pan state
let xOffset: number = 0;
let yOffset: number = 0;
let isPanning: boolean = false;
let lastMousePos: { x: number; y: number } = { x: 0, y: 0 };

// Scaling for zoom
let scale: number = 1;

// The starting X and Y
let startX :number; 
let startY : number;


// Represents the running list of canvas objects to be added to and deleted
const canvasObjects: CanvasObjects = new CanvasObjects();

// Sample box to draw
const box: Box = new Box(200, 100, '#ff6b6b', 100, 100);

canvasObjects.addDrawable(box);

// #region Event Listeners


//canvas.addEventListener("mousemove", e => {
  //if (isPanning) {
    //xOffset += (e.offsetX - startX);
    //yOffset += (e.offsetY - startY);
    //startX = e.offsetX;
    //startY = e.offsetY;
    //draw();
  //}
//});


// When inside of the canvas, this prevents right click menu showing when right clicking
canvas.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});

canvas.addEventListener('mousedown', (e) => {
    // Button 2 is the right mouse button.
    if (e.buttons === 2) {
        startX = e.offsetX;
        startY = e.offsetY;
        startPan(e);
        
    }
});

canvas.addEventListener('mousemove', (e) => {
    // Button 2 is the right mouse button.
    if (e.buttons === 2) {
        doPan(e);
    }
});

canvas.addEventListener('mouseup', (e) => {
    // Button 2 is the right mouse button.
    if (e.button === 2) {
        endPan();
    }
});

canvas.addEventListener('mouseleave', (e) => {
    // Button 2 is the right mouse button.
    if (e.buttons === 2) {
        endPan();
    }
});


canvas.addEventListener("wheel", e => {
  e.preventDefault();
  const zoomFactor = 1.15;
  const mouseX = e.offsetX;
  const mouseY = e.offsetY;
  const delta = e.deltaY < 0 ? zoomFactor : 1 / zoomFactor;

  const prevScale = scale;
  scale *= delta;

  xOffset = mouseX - (mouseX - xOffset) * (scale / prevScale);
  yOffset = mouseY - (mouseY - yOffset) * (scale / prevScale);

  draw();
});



// #endregion Event Listeners

function startPan(e: MouseEvent) {
    isPanning = true;
    lastMousePos = getMousePos(e);
}

function doPan(e: MouseEvent) {
    if (!isPanning) return;

    const currentMousePos = getMousePos(e);
    const deltaX = currentMousePos.x - lastMousePos.x;
    const deltaY = currentMousePos.y - lastMousePos.y;

    xOffset += deltaX;
    yOffset += deltaY;

    lastMousePos = currentMousePos;

    updateDisplay();
    draw();
}

function endPan() {
    isPanning = false;
}

function getMousePos(e: MouseEvent): { x: number; y: number } {
    const rect = canvas.getBoundingClientRect();
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };
}

function updateDisplay() {
    offsetDisplay.textContent = `X: ${Math.round(xOffset)}, Y: ${Math.round(yOffset)}`;
}

function drawGrid() {
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;

    const gridSize = 50;
    const startX = Math.floor(-xOffset / gridSize) * gridSize;
    const startY = Math.floor(-yOffset / gridSize) * gridSize;

    // Draw the vertical lines of the canvas.
    for (let x = startX; x < canvas.width - xOffset; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x + xOffset, 0);
        ctx.lineTo(x + xOffset, canvas.height);
        ctx.stroke();
    }

    // Draw the horizontal lines of the canvas.
    for (let y = startY; y < canvas.height - yOffset; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y + yOffset);
        ctx.lineTo(canvas.width, y + yOffset);
        ctx.stroke();
    }
}

function drawObjects() {
    const objects = canvasObjects.drawables;
    objects.forEach((drawable: IDrawable) => {
        drawable.drawWithOffset(ctx, xOffset, yOffset);
    });
}

function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Reset transformation matrix 
    ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(scale, 0, 0, scale, xOffset, yOffset);

    // Draw grid
    drawGrid();

    // Draw objects
    drawObjects();
}

// Initial draw
draw();
