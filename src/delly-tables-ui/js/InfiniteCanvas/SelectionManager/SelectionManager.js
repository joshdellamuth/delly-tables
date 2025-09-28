import { Position } from '../Shared/Position.js';
export class SelectionManager {
    constructor() {
        this.selectedDrawable = null;
        this.isDragging = false;
        this.dragOffset = new Position(null, null);
    }
    get selected() { return this.selectedDrawable; }
    get isDraggingShape() { return this.isDragging; }
    selectDrawable(drawable, mouseGridPos) {
        this.selectedDrawable = drawable;
        drawable.isSelected = true;
        this.isDragging = true;
        this.dragOffset.x = mouseGridPos.x - drawable.gridPosition.x;
        this.dragOffset.y = mouseGridPos.y - drawable.gridPosition.y;
    }
    clearSelection(canvasObjects) {
        this.selectedDrawable = null;
        this.isDragging = false;
        canvasObjects.resetSelectedShapes();
    }
    updateDrag(mouseGridPos) {
        if (this.isDragging && this.selectedDrawable &&
            mouseGridPos.x !== null && mouseGridPos.y !== null) {
            this.selectedDrawable.gridPosition.x = mouseGridPos.x - this.dragOffset.x;
            this.selectedDrawable.gridPosition.y = mouseGridPos.y - this.dragOffset.y;
        }
    }
    stopDragging() {
        this.isDragging = false;
    }
    trySelectAt(canvasObjects, mouseGridPos) {
        for (let i = canvasObjects.drawables.length - 1; i >= 0; i--) {
            const drawable = canvasObjects.drawables[i];
            if (drawable.isMouseOver(mouseGridPos.x, mouseGridPos.y)) {
                this.clearSelection(canvasObjects);
                this.selectDrawable(drawable, mouseGridPos);
                return true;
            }
        }
        return false;
    }
}
