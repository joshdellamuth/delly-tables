import { PositionOnDrawable } from '../../Shared/PositionOnDrawable.ts';
import { IDrawable } from '../IDrawable.ts';
import { Viewport } from '../../InputManager/Viewport/Viewport.ts';
import { Position } from '../../Shared/Position.ts';
import { Box } from '../Box/Box.ts';

export class DrawablesManager {
    private selectedDrawable: IDrawable | null = null;
    private isDragging: boolean = false;
    private isResizing: boolean = false;
    private isDrawing: boolean = false;

    private dragOffset: Position = new Position(null, null);
    public drawables: IDrawable[] = [];
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    public shapesButtonActivated: boolean = false;

    constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
        this.canvas = canvas;
    }

    get selected(): IDrawable | null { return this.selectedDrawable; }
    get isDraggingShape(): boolean { return this.isDragging; }
    get isResizingShape(): boolean { return this.isResizing; }


    public selectDrawable(drawable: IDrawable, mouseGridPos: Position): void {
        this.selectedDrawable = drawable;

        drawable.isSelected = true;

        this.dragOffset.x = mouseGridPos.x! - drawable.gridPosition.x!;
        this.dragOffset.y = mouseGridPos.y! - drawable.gridPosition.y!;
    }

    public updateDrag(mouseGridPos: Position): void {
        if (this.isDragging && this.selectedDrawable &&
            mouseGridPos.x !== null && mouseGridPos.y !== null) {
            this.selectedDrawable.gridPosition.x = mouseGridPos.x - this.dragOffset.x!;
            this.selectedDrawable.gridPosition.y = mouseGridPos.y - this.dragOffset.y!;
        }
    }

    public clearSelection(): void {
        this.drawables.forEach((drawable: IDrawable) => {
            drawable.isSelected = false;
        });

        this.selectedDrawable = null;
    }

    public toggleShapesButton(): void { 
        this.shapesButtonActivated = !this.shapesButtonActivated;
    }


    public startDragging(): void {
        this.isDragging = true;
        this.isResizing = false;
    }

    public stopDragging(): void {
        this.isDragging = false;
    }

    public startResizing(): void {
        this.isResizing = true;
        this.isDragging = false;
    }

    public stopResizing(): void {
        this.isResizing = false;
    }

    public updateResizing(mouseGridPos: Position): void {
        if (this.isDragging && this.selectedDrawable &&
            mouseGridPos.x !== null && mouseGridPos.y !== null) {
            this.selectedDrawable.gridPosition.x = mouseGridPos.x - this.dragOffset.x!;
            this.selectedDrawable.gridPosition.y = mouseGridPos.y - this.dragOffset.y!;
        }
    }

    public trySelectAt(mouseGridPos: Position): boolean {

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

    public addDrawables(drawables: IDrawable[]): void {
        this.drawables = this.drawables.concat(drawables);
    }

    public removeDrawables(drawables: IDrawable[]): void {
        this.drawables = this.drawables.filter((drawable: IDrawable) => !drawables.includes(drawable));
    }

    public drawObjects(ctx: CanvasRenderingContext2D, viewport: Viewport, canvas: HTMLCanvasElement): void {
        this.drawables.forEach((drawable: IDrawable) => {
            const screenPosition: Position = viewport.convertToScreenPos(drawable.gridPosition,
                canvas, viewport.panX, viewport.panY, viewport.scale);

            drawable.updateScreenPosition(screenPosition);
            drawable.draw(ctx);
        });
    }

    public clear(width: number, height: number): void {
        this.ctx.clearRect(0, 0, width, height);
    }

    public addDrawable(mouseGridPos: Position): void {
        const boxSize = 200;
        const sizeOffset = 200 / 2;
        let createdDrawable = new Box('new-box', boxSize, boxSize, '#5c9dffff', mouseGridPos.x! - sizeOffset!, mouseGridPos.y! - sizeOffset!);
        createdDrawable.isSelected = true;
        this.selectedDrawable = createdDrawable;
        this.drawables.push(createdDrawable);
    }

    public render(viewportActions: Viewport, canvas: HTMLCanvasElement): void {
        this.clear(canvas.width, canvas.height);

        this.ctx.save();
        this.ctx.translate(viewportActions.panX, viewportActions.panY);
        this.ctx.scale(viewportActions.scale, viewportActions.scale);

        this.drawObjects(this.ctx, viewportActions, this.canvas);

        this.ctx.restore();
    }
}