import { Position } from '../Shared/Position.js';
export class DrawablesManager {
    constructor(canvas, ctx) {
        this.selectedDrawable = null;
        this.isDragging = false;
        this.isResizing = false;
        this.dragOffset = new Position(null, null);
        this.drawables = [];
        this.ctx = ctx;
        this.canvas = canvas;
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
    updateDrag(mouseGridPos) {
        if (this.isDragging && this.selectedDrawable &&
            mouseGridPos.x !== null && mouseGridPos.y !== null) {
            this.selectedDrawable.gridPosition.x = mouseGridPos.x - this.dragOffset.x;
            this.selectedDrawable.gridPosition.y = mouseGridPos.y - this.dragOffset.y;
        }
    }
    clearSelection() {
        this.drawables.forEach((drawable) => {
            drawable.isSelected = false;
        });
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
    trySelectAt(mouseGridPos) {
        console.log('Trying to select at: ', mouseGridPos);
        for (let i = this.drawables.length - 1; i >= 0; i--) {
            const drawable = this.drawables[i];
            if (drawable.isMouseOver(mouseGridPos)) {
                this.clearSelection();
                this.selectDrawable(drawable, mouseGridPos);
                console.log('The selected drawable is: ', this.selectedDrawable);
                return true;
            }
        }
        return false;
    }
    drawObjects(ctx, viewport, canvas) {
        this.drawables.forEach((drawable) => {
            const screenPosition = viewport.convertToScreenPos(drawable.gridPosition, canvas, viewport.panX, viewport.panY, viewport.scale);
            drawable.updateScreenPosition(screenPosition);
            drawable.draw(ctx, viewport.panX, viewport.panY);
        });
    }
    clear(width, height) {
        this.ctx.clearRect(0, 0, width, height);
    }
    render(viewport, canvas) {
        this.clear(canvas.width, canvas.height);
        this.ctx.save();
        this.ctx.translate(viewport.panX, viewport.panY);
        this.ctx.scale(viewport.scale, viewport.scale);
        this.drawObjects(this.ctx, viewport, this.canvas);
        this.ctx.restore();
    }
}
