import { InfiniteCanvas } from "../../InfiniteCanvas/InfiniteCanvas.js";
import { ITool } from "./ITool.js";

export class MoveTool implements ITool {
    name = 'move';
    
    activate(canvas: InfiniteCanvas): void {
        canvas.canvas.style.cursor = 'grab';
    }
    
    deactivate(canvas: InfiniteCanvas): void {
        canvas.isPanning = false;
        canvas.canvas.style.cursor = 'default';
    }
    
    onMouseDown(e: MouseEvent, canvas: InfiniteCanvas): void {
        canvas.isPanning = true;
        canvas.canvas.style.cursor = 'grabbing';
        canvas.panStartX = e.offsetX;
        canvas.panStartY = e.offsetY;
    }
    
    onMouseMove(e: MouseEvent, canvas: InfiniteCanvas): void {
        if (canvas.isPanning) {
            canvas.panDistanceX += (e.offsetX - canvas.panStartX);
            canvas.panDistanceY += (e.offsetY - canvas.panStartY);
            canvas.panStartX = e.offsetX;
            canvas.panStartY = e.offsetY;
            canvas.draw();
        }
    }
    
    onMouseUp(e: MouseEvent, canvas: InfiniteCanvas): void {
        canvas.isPanning = false;
        canvas.canvas.style.cursor = 'grab';
    }
    
    onWheel(e: WheelEvent, canvas: InfiniteCanvas): void {
        e.preventDefault();
        const zoomFactor = 1.15;
        const mouseX = e.offsetX;
        const mouseY = e.offsetY;
        const delta = e.deltaY < 0 ? zoomFactor : 1 / zoomFactor;

        const prevScale = canvas.scale;
        canvas.scale *= delta;

        canvas.panDistanceX = mouseX - (mouseX - canvas.panDistanceX) * (canvas.scale / prevScale);
        canvas.panDistanceY = mouseY - (mouseY - canvas.panDistanceY) * (canvas.scale / prevScale);
        canvas.draw();
    }
}