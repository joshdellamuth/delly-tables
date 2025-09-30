import { Position } from '../Shared/Position.js';
export class SelectionManager {
    constructor() {
        this.selectedDrawable = null;
        this.isDragging = false;
        this.isResizing = false;
        this.dragOffset = new Position(null, null);
    }
    get selected() { return this.selectedDrawable; }
    get isDraggingShape() { return this.isDragging; }
    get isResizingShape() { return this.isResizing; }
    selectDrawable(drawable, mouseGridPos) {
        this.selectedDrawable = drawable;
        drawable.isSelected = true;
        this.dragOffset.x = mouseGridPos.x - drawable.gridPosition.x;
        this.dragOffset.y = mouseGridPos.y - drawable.gridPosition.y;
    }
    clearSelection(canvasObjects) {
        this.selectedDrawable = null;
        this.isDragging = false;
        this.isResizing = false;
        canvasObjects.resetSelectedShapes();
    }
    updateDrag(mouseGridPos) {
        if (this.isDragging && this.selectedDrawable &&
            mouseGridPos.x !== null && mouseGridPos.y !== null) {
            this.selectedDrawable.gridPosition.x = mouseGridPos.x - this.dragOffset.x;
            this.selectedDrawable.gridPosition.y = mouseGridPos.y - this.dragOffset.y;
        }
    }
    startDragging() {
        this.isDragging = true;
        this.isResizing = false;
    }
    stopDragging() {
        this.isDragging = false;
    }
    startResizing() {
        this.isResizing = true;
        this.isDragging = false;
    }
    stopResizing() {
        this.isResizing = false;
    }
    updateResizing(mouseGridPos) {
        if (this.isDragging && this.selectedDrawable &&
            mouseGridPos.x !== null && mouseGridPos.y !== null) {
            this.selectedDrawable.gridPosition.x = mouseGridPos.x - this.dragOffset.x;
            this.selectedDrawable.gridPosition.y = mouseGridPos.y - this.dragOffset.y;
        }
    }
    trySelectAt(canvasObjects, mouseGridPos) {
        for (let i = canvasObjects.drawables.length - 1; i >= 0; i--) {
            const drawable = canvasObjects.drawables[i];
            if (drawable.isMouseOver(mouseGridPos)) {
                this.clearSelection(canvasObjects);
                this.selectDrawable(drawable, mouseGridPos);
                console.log('The selected drawable is: ', this.selectedDrawable);
                return true;
            }
        }
        return false;
    }
}
