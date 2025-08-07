import { Box } from './CoreObjects/Box.js';
import { CanvasObjects } from './CanvasObjects/CanvasObjects.js';
// This gets the canvas element and its context.
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let xOffset = 0;
let yOffset = 0;
// Pan state
let isPanning = false;
// Scaling for zoom
let scale = 1;
// The starting X and Y
let startX;
let startY;
// #region Add shapes to canvas
// Represents the running list of canvas objects to be added to and deleted
const canvasObjects = new CanvasObjects();
// Sample box to draw
const box1 = new Box(200, 100, '#5c9dffff', 100, 100);
canvasObjects.addDrawable(box1);
const box2 = new Box(200, 200, '#00446bff', 400, 500);
canvasObjects.addDrawable(box2);
const box3 = new Box(200, 300, '#8ef7ffff', 750, 300);
canvasObjects.addDrawable(box3);
const box4 = new Box(100, 300, '#ecaf2aff', 600, -300);
canvasObjects.addDrawable(box4);
// #endregion Add shapes to canvas
// #region Event Listeners
// MOUSE MOVE
canvas.addEventListener("mousemove", e => {
    if (isPanning) {
        xOffset += (e.offsetX - startX);
        yOffset += (e.offsetY - startY);
        startX = e.offsetX;
        startY = e.offsetY;
        draw();
    }
});
// MOUSE DOWN ON CANVAS
canvas.addEventListener('mousedown', (e) => {
    isPanning = true;
    startX = e.offsetX;
    startY = e.offsetY;
});
// MOUSE MOVE ON CANVAS
canvas.addEventListener('mousemove', (e) => {
    if (isPanning) {
        xOffset += (e.offsetX - startX);
        yOffset += (e.offsetY - startY);
        startX = e.offsetX;
        startY = e.offsetY;
        draw();
    }
});
// MOUSE UP ON CANVAS
canvas.addEventListener("mouseup", () => isPanning = false);
// MOUSE LEAVE ON CANVAS
canvas.addEventListener("mouseleave", () => isPanning = false);
// MOUSE WHEEL ON CANVAS
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
// When inside of the canvas, this prevents right click menu showing when right clicking
canvas.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});
// #endregion Event Listeners
function drawObjects() {
    const objects = canvasObjects.drawables;
    objects.forEach((drawable) => {
        drawable.drawWithOffset(ctx, xOffset, yOffset);
    });
}
function draw() {
    // Reset transformation matrix 
    ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(scale, 0, 0, scale, xOffset, yOffset);
    // Draw the objects on the canvas
    drawObjects();
}
// Initial draw
draw();
