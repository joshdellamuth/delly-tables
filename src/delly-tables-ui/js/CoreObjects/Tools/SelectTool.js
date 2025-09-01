export class SelectTool {
    constructor() {
        this.name = 'select';
        this.selectedObjects = [];
    }
    activate(canvas) {
        canvas.canvas.style.cursor = 'default';
    }
    deactivate(canvas) {
        this.selectedObjects = [];
    }
    onMouseDown(e, canvas) {
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
    findObjectAt(x, y, canvas) {
        // Implementation to find which object was clicked
        // This depends on your IDrawable interface having hit detection
        return null;
    }
    drawSelection(canvas) {
        // Draw selection indicators around selected objects
    }
}
