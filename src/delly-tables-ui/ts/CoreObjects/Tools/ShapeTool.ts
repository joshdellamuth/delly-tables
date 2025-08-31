import { InfiniteCanvas } from "../../InfiniteCanvas/InfiniteCanvas.js";
import { Box } from "../../CoreObjects/Box.js";
import { ITool } from "./ITool.js";

export class ShapeTool implements ITool {
    name = 'shape';
    private isDrawing = false;
    private startX = 0;
    private startY = 0;
    
    activate(canvas: InfiniteCanvas): void {
        canvas.canvas.style.cursor = 'crosshair';
    }
    
    deactivate(canvas: InfiniteCanvas): void {
        this.isDrawing = false;
        canvas.canvas.style.cursor = 'default';
    }
    
    onMouseDown(e: MouseEvent, canvas: InfiniteCanvas): void {
        this.isDrawing = true;
        // Convert screen coordinates to world coordinates
        this.startX = (e.offsetX - canvas.panDistanceX) / canvas.scale;
        this.startY = (e.offsetY - canvas.panDistanceY) / canvas.scale;
    }
    
    onMouseMove(e: MouseEvent, canvas: InfiniteCanvas): void {
        if (this.isDrawing) {
            // Show preview of shape being drawn
            const currentX = (e.offsetX - canvas.panDistanceX) / canvas.scale;
            const currentY = (e.offsetY - canvas.panDistanceY) / canvas.scale;
            
            // Draw preview shape
            canvas.draw();
            canvas.ctx.strokeStyle = '#000';
            canvas.ctx.strokeRect(this.startX, this.startY, 
                                currentX - this.startX, currentY - this.startY);
        }
    }
    
    onMouseUp(e: MouseEvent, canvas: InfiniteCanvas): void {
        if (this.isDrawing) {
            const endX = (e.offsetX - canvas.panDistanceX) / canvas.scale;
            const endY = (e.offsetY - canvas.panDistanceY) / canvas.scale;
            
            // Create actual shape
            const box = new Box(
                Math.abs(endX - this.startX),
                Math.abs(endY - this.startY),
                '#5c9dffff',
                Math.min(this.startX, endX),
                Math.min(this.startY, endY)
            );
            canvas.canvasObjects.addDrawable(box);
            canvas.draw();
        }
        this.isDrawing = false;
    }
}