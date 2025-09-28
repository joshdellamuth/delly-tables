import { CanvasObjects } from '../CanvasObjects/CanvasObjects.js';
import { IDrawable } from '../CoreObjects/IDrawable.js';
import { Position } from '../InfiniteCanvas/Position.js';
import { Utilities } from './Utilities.js';

export class SelectionManager {
private selectedDrawable: IDrawable | null = null;
private isDragging: boolean = false;
private dragOffset: Position = new Position(null, null);

get selected(): IDrawable | null { return this.selectedDrawable; }
get isDraggingShape(): boolean { return this.isDragging; }

selectDrawable(drawable: IDrawable, mouseGridPos: Position): void {
    this.selectedDrawable = drawable;
    drawable.isSelected = true;
    
    this.isDragging = true;
    this.dragOffset.x = mouseGridPos.x! - drawable.gridPosition.x!;
    this.dragOffset.y = mouseGridPos.y! - drawable.gridPosition.y!;
}

clearSelection(canvasObjects: CanvasObjects): void {
    this.selectedDrawable = null;
    this.isDragging = false;
    canvasObjects.resetSelectedShapes();
}

updateDrag(mouseGridPos: Position): void {
    if (this.isDragging && this.selectedDrawable && 
        mouseGridPos.x !== null && mouseGridPos.y !== null) {
        this.selectedDrawable.gridPosition.x = mouseGridPos.x - this.dragOffset.x!;
        this.selectedDrawable.gridPosition.y = mouseGridPos.y - this.dragOffset.y!;
    }
}

stopDragging(): void {
    this.isDragging = false;
}

trySelectAt(canvasObjects: CanvasObjects, mouseGridPos: Position): boolean {
    for (let i = canvasObjects.drawables.length - 1; i >= 0; i--) {
        const drawable = canvasObjects.drawables[i];
        if (drawable.isMouseOver(mouseGridPos.x!, mouseGridPos.y!, /* canvas context needed */)) {
            this.clearSelection(canvasObjects);
            this.selectDrawable(drawable, mouseGridPos);
            return true;
        }
    }
    return false;
}
}