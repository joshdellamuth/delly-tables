console.log("Before the imports!");

import { Box } from './CoreObjects/Box.js';
import { IDrawable } from './CoreObjects/IDrawable.js';
import { CanvasObjects } from './CanvasObjects/CanvasObjects.js';

console.log("After the imports!");


// This gets the canvas element and its context.
const canvas: HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement;
const ctx: CanvasRenderingContext2D = canvas.getContext('2d') as CanvasRenderingContext2D;

// This is for the element that displays the x and y coordinates on the grid.
const offsetDisplay: HTMLElement = document.getElementById('offset') as HTMLElement;

// Pan state
let panOffset: { x: number; y: number } = { x: 0, y: 0 };
let isPanning: boolean = false;
let lastMousePos: { x: number; y: number } = { x: 0, y: 0 };

// Represents the running list of canvas objects to be added to and deleted
const canvasObjects: CanvasObjects = new CanvasObjects();

// Sample box to draw
const box: Box = new Box(200, 100, '#ff6b6b', 100, 100);

canvasObjects.addDrawable(box);

// #region Event Listeners

// When inside of the canvas, this prevents right click menu showing when right clicking
canvas.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});

canvas.addEventListener('mousedown', (e) => {
    // Button 2 is the right mouse button.
    if (e.buttons === 2) {
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
    if (e.buttons === 2) {
        endPan();
    }
});

canvas.addEventListener('mouseleave', (e) => {
    // Button 2 is the right mouse button.
    if (e.buttons === 2) {
        endPan();
    }
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

    panOffset.x += deltaX;
    panOffset.y += deltaY;

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
    offsetDisplay.textContent = `X: ${Math.round(panOffset.x)}, Y: ${Math.round(panOffset.y)}`;
}

function drawGrid() {
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;

    const gridSize = 50;
    const startX = Math.floor(-panOffset.x / gridSize) * gridSize;
    const startY = Math.floor(-panOffset.y / gridSize) * gridSize;

    // Vertical lines
    for (let x = startX; x < canvas.width - panOffset.x; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x + panOffset.x, 0);
        ctx.lineTo(x + panOffset.x, canvas.height);
        ctx.stroke();
    }

    // Horizontal lines
    for (let y = startY; y < canvas.height - panOffset.y; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y + panOffset.y);
        ctx.lineTo(canvas.width, y + panOffset.y);
        ctx.stroke();
    }
}

function drawObjects() {
    const objects = canvasObjects.drawables;
    objects.forEach((drawable: IDrawable) => {
        drawable.drawWithOffset(ctx, panOffset.x, panOffset.y);
    });
}

function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    drawGrid();

    // Draw objects
    drawObjects();
}

// Initial draw
draw();