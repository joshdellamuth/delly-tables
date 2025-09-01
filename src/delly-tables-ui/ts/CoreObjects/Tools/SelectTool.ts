import { InfiniteCanvas } from "../../InfiniteCanvas/InfiniteCanvas.js";
import { IDrawable } from "../../CoreObjects/IDrawable.js";
import { ITool } from "./ITool.js";

export class SelectTool implements ITool {
    name = 'select';
    private selectedObjects: IDrawable[] = [];
    
    activate(canvas: InfiniteCanvas): void {
        canvas.canvas.style.cursor = 'default';
    }
    
    deactivate(canvas: InfiniteCanvas): void {
        this.selectedObjects = [];
    }
    
    onMouseDown(e: MouseEvent, canvas: InfiniteCanvas): void {
        // Convert to world coordinates
        const worldX = (e.offsetX - canvas.panDistanceX) / canvas.scale;
        const worldY = (e.offsetY - canvas.panDistanceY) / canvas.scale;
        
        // Find object at this position
        const clickedObject = this.findObjectAt(worldX, worldY, canvas);
        if (clickedObject) {
            this.selectedObjects = [clickedObject];
            canvas.draw();
            this.drawSelection(canvas);
        }
    }
    
    private findObjectAt(x: number, y: number, canvas: InfiniteCanvas): IDrawable | null {
        // Implementation to find which object was clicked
        // This depends on your IDrawable interface having hit detection
        return null;
    }
    
    private drawSelection(canvas: InfiniteCanvas): void {
        // Draw selection indicators around selected objects
    }
}