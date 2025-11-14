import { PositionOnDrawable } from '../../Shared/PositionOnDrawable.ts';
import { IDrawable } from '../IDrawable.ts';
import { Viewport } from '../../InputManager/Viewport/Viewport.ts';
import { Position } from '../../Shared/Position.ts';
import { Box } from '../Box/Box.ts';
import { SelectBoxManager } from '../../InputManager/SelectBoxManager/SelectBoxManager.ts';
import { v4 as uuidv4 } from 'uuid';

export class DrawablesManager {
    private selectedDrawable: IDrawable | null = null;
    private isDragging: boolean = false;
    private isResizing: boolean = false;
    public isDrawingShape: boolean = false;
    private addShapePosition: Position = new Position(null, null);
    private shapeToAddId: string = "";

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

    public startDrawing(mouseGridPos: Position): void {
        this.addShapePosition = mouseGridPos;
        this.isDrawingShape = true;
    }

    public updateDrawing(mouseGridPos: Position): void {
        if (this.isDrawingShape) {
            // Calculate the different between the start position and the current mouse position to determine the width and height
            const diffX = mouseGridPos.x! - this.addShapePosition.x!;
            const diffY = mouseGridPos.y! - this.addShapePosition.y!;

            // Calculate the width and height of the new shape
            const width = Math.abs(diffX);
            const height = Math.abs(diffY);

            if (this.shapeToAddId == "") {
                this.shapeToAddId = uuidv4();
                let shapeToAdd = new Box(this.shapeToAddId, width, height, '#e4bf1aff', this.addShapePosition.x!, this.addShapePosition.y!, true);
                shapeToAdd.draw(this.ctx);
                this.drawables.push(shapeToAdd);
                this.selectedDrawable = shapeToAdd;
            }

            const foundDrawable = this.drawables.find(d => d.ID === this.shapeToAddId);
            if (foundDrawable) {
                foundDrawable.lastMousePosition = PositionOnDrawable.BottomRightCorner;
                foundDrawable!.resize(mouseGridPos);
            }

            console.log('The shape to add id is ' + this.shapeToAddId);
            console.log('The found shape to add is ');
            console.log(foundDrawable);
            console.log('The drawables are ');
            console.log(this.drawables);
            console.log('The width of the found drawable is ' + foundDrawable!.width);
            console.log('The height of the found drawable is ' + foundDrawable!.height);
        }
    }


    public stopDrawing(): void {
        if (this.isDrawingShape) {
            this.shapesButtonActivated = false;
            this.isDrawingShape = false;
            this.shapeToAddId = "";
        }
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
        console.log('Shapes button activated is now set to ' + this.shapesButtonActivated);
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

    public drawObjects(ctx: CanvasRenderingContext2D, viewport: Viewport, canvas: HTMLCanvasElement, selectBoxManager: SelectBoxManager, mouseGridPos: Position): void {
        this.drawables.forEach((drawable: IDrawable) => {
            const screenPosition: Position = viewport.convertToScreenPos(drawable.gridPosition,
                canvas, viewport.panX, viewport.panY, viewport.scale);

            if (selectBoxManager.isDrawing) {
                selectBoxManager.drawSelectBox(mouseGridPos);
            }

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

    public render(viewport: Viewport, canvas: HTMLCanvasElement, selectBoxManager: SelectBoxManager, mouseGridPos: Position): void {
        this.clear(canvas.width, canvas.height);

        this.ctx.save();
        this.ctx.translate(viewport.panX, viewport.panY);
        this.ctx.scale(viewport.scale, viewport.scale);

        this.drawObjects(this.ctx, viewport, this.canvas, selectBoxManager, mouseGridPos);

        this.ctx.restore();
    }
}