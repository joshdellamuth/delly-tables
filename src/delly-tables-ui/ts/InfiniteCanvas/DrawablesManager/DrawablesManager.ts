import { PositionOnDrawable } from '../Drawables/PositionOnDrawable.js';
import { IDrawable } from '../Drawables/IDrawable.js';
import { Viewport } from '../Viewport/Viewport.js';
import { Position } from '../Shared/Position.js';

export class DrawablesManager {
    private selectedDrawable: IDrawable | null = null;
    private isDragging: boolean = false;
    private isResizing: boolean = false;
    private dragOffset: Position = new Position(null, null);
    public drawables: IDrawable[] = [];
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;

    constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
        this.canvas = canvas;
    }

    get selected(): IDrawable | null { return this.selectedDrawable; }
    get isDraggingShape(): boolean { return this.isDragging; }
    get isResizingShape(): boolean { return this.isResizing; }




    selectDrawable(drawable: IDrawable, mouseGridPos: Position): void {
        this.selectedDrawable = drawable;

        drawable.isSelected = true;

        this.dragOffset.x = mouseGridPos.x! - drawable.gridPosition.x!;
        this.dragOffset.y = mouseGridPos.y! - drawable.gridPosition.y!;
    }

    updateDrag(mouseGridPos: Position): void {
        if (this.isDragging && this.selectedDrawable &&
            mouseGridPos.x !== null && mouseGridPos.y !== null) {
            this.selectedDrawable.gridPosition.x = mouseGridPos.x - this.dragOffset.x!;
            this.selectedDrawable.gridPosition.y = mouseGridPos.y - this.dragOffset.y!;
        }
    }

    clearSelection(): void {
        this.drawables.forEach((drawable: IDrawable) => {
            drawable.isSelected = false;
        });
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

    trySelectAt(mouseGridPos: Position): boolean {

        for (let i = this.drawables.length - 1; i >= 0; i--) {
            const drawable = this.drawables[i];
            let mousePosOnDrawable = drawable.getMousePosOnDrawable(mouseGridPos);
            if (mousePosOnDrawable != PositionOnDrawable.NotOn) {
                this.clearSelection();
                this.selectDrawable(drawable, mouseGridPos);
                return true;
            }
        }
        return false;
    }

    drawObjects(ctx: CanvasRenderingContext2D, viewport: Viewport, canvas: HTMLCanvasElement): void {
        this.drawables.forEach((drawable: IDrawable) => {
            const screenPosition: Position = viewport.convertToScreenPos(drawable.gridPosition,
                canvas, viewport.panX, viewport.panY, viewport.scale);

            drawable.updateScreenPosition(screenPosition);
            drawable.draw(ctx, viewport.panX, viewport.panY);
        });
    }

    clear(width: number, height: number): void {
        this.ctx.clearRect(0, 0, width, height);
    }

    render(viewport: Viewport, canvas: HTMLCanvasElement): void {
        this.clear(canvas.width, canvas.height);

        this.ctx.save();
        this.ctx.translate(viewport.panX, viewport.panY);
        this.ctx.scale(viewport.scale, viewport.scale);

        this.drawObjects(this.ctx, viewport, this.canvas);

        this.ctx.restore();
    }
}