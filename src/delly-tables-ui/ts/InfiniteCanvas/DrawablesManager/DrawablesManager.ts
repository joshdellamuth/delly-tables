import { CanvasDrawables } from '../Drawables/CanvasDrawables.js';
import { PositionOnDrawable } from '../Drawables/PositionOnDrawable.js';
import { IDrawable } from '../Drawables/IDrawable.js';
import { Position } from '../Shared/Position.js';

export class DrawablesManager {
    private selectedDrawable: IDrawable | null = null;
    private isDragging: boolean = false;
    private isResizing: boolean = false;
    private dragOffset: Position = new Position(null, null);

    get selected(): IDrawable | null { return this.selectedDrawable; }
    get isDraggingShape(): boolean { return this.isDragging; }
    get isResizingShape(): boolean { return this.isResizing; }

    selectDrawable(drawable: IDrawable, mouseGridPos: Position): void {
        this.selectedDrawable = drawable;

        drawable.isSelected = true;

        this.dragOffset.x = mouseGridPos.x! - drawable.gridPosition.x!;
        this.dragOffset.y = mouseGridPos.y! - drawable.gridPosition.y!;
    }

    clearSelection(canvasObjects: CanvasDrawables): void {
        this.selectedDrawable = null;
        this.isDragging = false;
        this.isResizing = false;
        canvasObjects.resetSelectedShapes();
    }

    updateDrag(mouseGridPos: Position): void {
        if (this.isDragging && this.selectedDrawable &&
            mouseGridPos.x !== null && mouseGridPos.y !== null) {
            this.selectedDrawable.gridPosition.x = mouseGridPos.x - this.dragOffset.x!;
            this.selectedDrawable.gridPosition.y = mouseGridPos.y - this.dragOffset.y!;
        }
    }

    startDragging(): void {
        this.isDragging = true;
        this.isResizing = false;
    }

    stopDragging(): void {
        this.isDragging = false;
    }

    startResizing(): void {
        this.isResizing = true;
        this.isDragging = false;
    }

    stopResizing(): void {
        this.isResizing = false;
    }

    updateResizing(mouseGridPos: Position): void {
        if (this.isDragging && this.selectedDrawable &&
            mouseGridPos.x !== null && mouseGridPos.y !== null) {
            this.selectedDrawable.gridPosition.x = mouseGridPos.x - this.dragOffset.x!;
            this.selectedDrawable.gridPosition.y = mouseGridPos.y - this.dragOffset.y!;
        }
    }

    trySelectAt(canvasObjects: CanvasDrawables, mouseGridPos: Position): boolean {
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