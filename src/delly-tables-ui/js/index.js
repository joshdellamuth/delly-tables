const canvas = document.getElementById('gridCanvas');
const ctx = canvas.getContext('2d');
const coordsDisplay = document.getElementById('coordinates');
const shapeColorPicker = document.getElementById('shapeColor');
const fillModeSelect = document.getElementById('fillMode');

// Grid and view states
let gridSize = 40;
let offsetX = 0;
let offsetY = 0;

// Tool state
let currentTool = 'pan';
let shapes = [];

// Drawing state
let isDrawing = false;
let isDragging = false;
let startX = 0;
let startY = 0;
let lastMouseX = 0;
let lastMouseY = 0;
let previewShape = null;

// Selection and dragging state
let selectedShape = null;
let isDraggingShape = false;
let dragOffsetX = 0;
let dragOffsetY = 0;

// Convert screen coordinates to grid coordinates
function screenToGrid(screenX, screenY) {
    return {
        x: (screenX - offsetX) / gridSize,
        y: (screenY - offsetY) / gridSize
    };
}

// Convert grid coordinates to screen coordinates
function gridToScreen(gridX, gridY) {
    return {
        x: gridX * gridSize + offsetX,
        y: gridY * gridSize + offsetY
    };
}

// Check if a point is inside a shape
function isPointInShape(mouseX, mouseY, shape) {
const start = gridToScreen(shape.startX, shape.startY);
const end = gridToScreen(shape.endX, shape.endY);

if (shape.type === 'rectangle') {
    const minX = Math.min(start.x, end.x);
    const maxX = Math.max(start.x, end.x);
    const minY = Math.min(start.y, end.y);
    const maxY = Math.max(start.y, end.y);
    
    return mouseX >= minX && mouseX <= maxX && mouseY >= minY && mouseY <= maxY;
}

return false;
}

// Find the topmost shape at a given point
function getShapeAtPoint(mouseX, mouseY) {
// Search from end to beginning to get topmost shape
for (let i = shapes.length - 1; i >= 0; i--) {
    if (isPointInShape(mouseX, mouseY, shapes[i])) {
        return shapes[i];
    }
}
return null;
}

function drawShapes() {
shapes.forEach(shape => {
    const start = gridToScreen(shape.startX, shape.startY);
    const end = gridToScreen(shape.endX, shape.endY);

    ctx.strokeStyle = shape.color;
    ctx.fillStyle = shape.color;
    ctx.lineWidth = shape === selectedShape ? 3 : 2;

    if (shape.type === 'rectangle') {
        const width = end.x - start.x;
        const height = end.y - start.y;

        if (shape.fillMode === 'fill') {
            ctx.fillRect(start.x, start.y, width, height);
        } else {
            ctx.strokeRect(start.x, start.y, width, height);
        }
    }

    // Draw selection indicator
    if (shape === selectedShape) {
        ctx.strokeStyle = '#ff6b00';
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);
        
        if (shape.type === 'rectangle') {
            const width = end.x - start.x;
            const height = end.y - start.y;
            ctx.strokeRect(start.x - 5, start.y - 5, width + 10, height + 10);
        }
        
        ctx.setLineDash([]);
    }
});
}

function drawPreviewShape() {
if (!previewShape) return;

const start = gridToScreen(previewShape.startX, previewShape.startY);
const end = gridToScreen(previewShape.endX, previewShape.endY);

ctx.strokeStyle = previewShape.color;
ctx.fillStyle = previewShape.color;
ctx.lineWidth = 2;
ctx.setLineDash([5, 5]); // Dashed line for preview

if (previewShape.type === 'rectangle') {
    const width = end.x - start.x;
    const height = end.y - start.y;
    ctx.strokeRect(start.x, start.y, width, height);
}

ctx.setLineDash([]); // Reset to solid line
}

// Grid colors
const majorGridColor = '#ddd';
const minorGridColor = '#f0f0f0';
const originColor = '#ff0000';

function drawGrid() {
ctx.clearRect(0, 0, canvas.width, canvas.height);

// Calculate visible grid range
const startX = Math.floor(-offsetX / gridSize) - 1;
const endX = Math.ceil((canvas.width - offsetX) / gridSize) + 1;
const startY = Math.floor(-offsetY / gridSize) - 1;
const endY = Math.ceil((canvas.height - offsetY) / gridSize) + 1;

// Draw minor grid lines
ctx.strokeStyle = minorGridColor;
ctx.lineWidth = 1;
ctx.beginPath();

// Vertical lines
for (let i = startX; i <= endX; i++) {
    const x = i * gridSize + offsetX;
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
}

// Horizontal lines
for (let i = startY; i <= endY; i++) {
    const y = i * gridSize + offsetY;
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
}

ctx.stroke();

// Draw major grid lines (every 5th line)
ctx.strokeStyle = majorGridColor;
ctx.lineWidth = 2;
ctx.beginPath();

// Major vertical lines
for (let i = startX; i <= endX; i++) {
    if (i % 5 === 0) {
        const x = i * gridSize + offsetX;
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
    }
}

// Major horizontal lines
for (let i = startY; i <= endY; i++) {
    if (i % 5 === 0) {
        const y = i * gridSize + offsetY;
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
    }
}

ctx.stroke();

// Draw origin axes
ctx.strokeStyle = originColor;
ctx.lineWidth = 3;
ctx.beginPath();

// X-axis (horizontal line through origin)
if (offsetY >= 0 && offsetY <= canvas.height) {
    ctx.moveTo(0, offsetY);
    ctx.lineTo(canvas.width, offsetY);
}

// Y-axis (vertical line through origin)
if (offsetX >= 0 && offsetX <= canvas.width) {
    ctx.moveTo(offsetX, 0);
    ctx.lineTo(offsetX, canvas.height);
}

ctx.stroke();

// Draw shapes
drawShapes();

// Draw preview shape
drawPreviewShape();

// Update coordinates display
const gridX = Math.round(-offsetX / gridSize);
const gridY = Math.round(-offsetY / gridSize);
coordsDisplay.textContent = `Position: (${gridX}, ${gridY})`;
}

// Mouse event handlers
canvas.addEventListener('mousedown', (e) => {
const rect = canvas.getBoundingClientRect();
const mouseX = e.clientX - rect.left;
const mouseY = e.clientY - rect.top;

if (currentTool === 'pan') {
    isDragging = true;
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
    canvas.style.cursor = 'grabbing';
} else if (currentTool === 'select') {
    const clickedShape = getShapeAtPoint(mouseX, mouseY);
    
    if (clickedShape && clickedShape === selectedShape) {
        // Start dragging the selected shape
        isDraggingShape = true;
        const gridPos = screenToGrid(mouseX, mouseY);
        dragOffsetX = gridPos.x - selectedShape.startX;
        dragOffsetY = gridPos.y - selectedShape.startY;
        canvas.style.cursor = 'move';
    } else {
        // Select a different shape or deselect
        selectedShape = clickedShape;
        canvas.style.cursor = clickedShape ? 'move' : 'default';
    }
    
    drawGrid();
} else {
    isDrawing = true;
    selectedShape = null; // Deselect when drawing
    const gridPos = screenToGrid(mouseX, mouseY);
    startX = gridPos.x;
    startY = gridPos.y;

    previewShape = {
        type: currentTool,
        startX: startX,
        startY: startY,
        endX: startX,
        endY: startY,
        color: shapeColorPicker.value,
        fillMode: fillModeSelect.value
    };
    canvas.style.cursor = 'crosshair';
}
});

canvas.addEventListener('mousemove', (e) => {
const rect = canvas.getBoundingClientRect();
const mouseX = e.clientX - rect.left;
const mouseY = e.clientY - rect.top;

if (currentTool === 'pan' && isDragging) {
    const deltaX = e.clientX - lastMouseX;
    const deltaY = e.clientY - lastMouseY;

    offsetX += deltaX;
    offsetY += deltaY;

    lastMouseX = e.clientX;
    lastMouseY = e.clientY;

    drawGrid();
} else if (currentTool === 'select' && isDraggingShape && selectedShape) {
    const gridPos = screenToGrid(mouseX, mouseY);
    const newStartX = gridPos.x - dragOffsetX;
    const newStartY = gridPos.y - dragOffsetY;
    
    const deltaX = newStartX - selectedShape.startX;
    const deltaY = newStartY - selectedShape.startY;
    
    selectedShape.startX = newStartX;
    selectedShape.startY = newStartY;
    selectedShape.endX += deltaX;
    selectedShape.endY += deltaY;
    
    drawGrid();
} else if (currentTool === 'select' && !isDraggingShape) {
    // Update cursor based on whether we're hovering over a shape
    const hoverShape = getShapeAtPoint(mouseX, mouseY);
    canvas.style.cursor = hoverShape ? 'pointer' : 'default';
} else if (currentTool !== 'pan' && currentTool !== 'select' && isDrawing) {
    const gridPos = screenToGrid(mouseX, mouseY);
    previewShape.endX = gridPos.x;
    previewShape.endY = gridPos.y;
    drawGrid();
}
});

canvas.addEventListener('mouseup', (e) => {
if (currentTool === 'pan') {
    isDragging = false;
    canvas.style.cursor = 'grab';
} else if (currentTool === 'select') {
    isDraggingShape = false;
    canvas.style.cursor = selectedShape ? 'move' : 'default';
} else if (isDrawing) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const gridPos = screenToGrid(mouseX, mouseY);

    // Only add shape if there's actual movement
    if (Math.abs(gridPos.x - startX) > 0.1 || Math.abs(gridPos.y - startY) > 0.1) {
        shapes.push({
            type: currentTool,
            startX: startX,
            startY: startY,
            endX: gridPos.x,
            endY: gridPos.y,
            color: shapeColorPicker.value,
            fillMode: fillModeSelect.value
        });
    }

    isDrawing = false;
    previewShape = null;
    drawGrid();
}
});

canvas.addEventListener('mouseleave', () => {
isDragging = false;
isDrawing = false;
isDraggingShape = false;
previewShape = null;
updateCursor();
drawGrid();
});

function updateCursor() {
if (currentTool === 'pan') {
    canvas.style.cursor = 'grab';
} else if (currentTool === 'select') {
    canvas.style.cursor = selectedShape ? 'move' : 'default';
} else {
    canvas.style.cursor = 'crosshair';
}
}

// Touch support for mobile
canvas.addEventListener('touchstart', (e) => {
e.preventDefault();
const touch = e.touches[0];
const rect = canvas.getBoundingClientRect();
lastMouseX = touch.clientX - rect.left;
lastMouseY = touch.clientY - rect.top;
isDragging = true;
});

canvas.addEventListener('touchmove', (e) => {
e.preventDefault();
if (isDragging) {
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const currentX = touch.clientX - rect.left;
    const currentY = touch.clientY - rect.top;

    const deltaX = currentX - lastMouseX;
    const deltaY = currentY - lastMouseY;

    offsetX += deltaX;
    offsetY += deltaY;

    lastMouseX = currentX;
    lastMouseY = currentY;

    drawGrid();
}
});

canvas.addEventListener('touchend', (e) => {
e.preventDefault();
isDragging = false;
});

// Tool management
function setTool(tool) {
currentTool = tool;
selectedShape = null; // Clear selection when changing tools

// Update button styles
document.querySelectorAll('.controls button').forEach(btn => {
    btn.classList.remove('active-tool');
});
document.getElementById(tool + 'Tool').classList.add('active-tool');

// Update cursor
updateCursor();

// Clear any ongoing operations
isDrawing = false;
isDragging = false;
isDraggingShape = false;
previewShape = null;
drawGrid();
}

// Control functions
function resetView() {
offsetX = 0;
offsetY = 0;
drawGrid();
}

function toggleGridSize() {
gridSize = gridSize === 40 ? 20 : 40;
drawGrid();
}

function clearShapes() {
shapes = [];
selectedShape = null;
previewShape = null;
drawGrid();
}

// Handle window resize
window.addEventListener('resize', () => {
drawGrid();
});

// Initial draw
drawGrid();