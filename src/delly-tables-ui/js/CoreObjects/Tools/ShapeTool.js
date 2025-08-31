import { Box } from "../../CoreObjects/Box.js";
export class ShapeTool {
    constructor() {
        this.name = 'shape';
        this.isDrawing = false;
        this.startX = 0;
        this.startY = 0;
    }
    activate(canvas) {
        canvas.canvas.style.cursor = 'crosshair';
    }
    deactivate(canvas) {
        this.isDrawing = false;
        canvas.canvas.style.cursor = 'default';
    }
    onMouseDown(e, canvas) {
        this.isDrawing = true;
        // Convert screen coordinates to world coordinates
        this.startX = (e.offsetX - canvas.panDistanceX) / canvas.scale;
        this.startY = (e.offsetY - canvas.panDistanceY) / canvas.scale;
    }
    onMouseMove(e, canvas) {
        if (this.isDrawing) {
            // Show preview of shape being drawn
            const currentX = (e.offsetX - canvas.panDistanceX) / canvas.scale;
            const currentY = (e.offsetY - canvas.panDistanceY) / canvas.scale;
            // Draw preview shape
            canvas.draw();
            canvas.ctx.strokeStyle = '#000';
            canvas.ctx.strokeRect(this.startX, this.startY, currentX - this.startX, currentY - this.startY);
        }
    }
    onMouseUp(e, canvas) {
        if (this.isDrawing) {
            const endX = (e.offsetX - canvas.panDistanceX) / canvas.scale;
            const endY = (e.offsetY - canvas.panDistanceY) / canvas.scale;
            // Create actual shape
            const box = new Box(Math.abs(endX - this.startX), Math.abs(endY - this.startY), '#5c9dffff', Math.min(this.startX, endX), Math.min(this.startY, endY));
            canvas.canvasObjects.addDrawable(box);
            canvas.draw();
        }
        this.isDrawing = false;
    }
}
