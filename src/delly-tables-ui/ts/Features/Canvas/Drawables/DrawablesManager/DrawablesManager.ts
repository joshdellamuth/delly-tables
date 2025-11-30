import { CanvasPosition } from '../../Shared/CanvasPosition.ts';
import { IDrawable } from '../IDrawable.ts';
import { Viewport } from '../../InputManager/Viewport/Viewport.ts';
import { Position } from '../../Shared/Position.ts';
import { Box } from '../Box/Box.ts';
import { SelectBoxManager } from '../../InputManager/SelectBoxManager/SelectBoxManager.ts';
import { MassSelectionBox } from '../MassSelectionBox/MassSelectionBox.ts';
import { v4 as uuidv4 } from 'uuid';

export class DrawablesManager {
    // This will store UUIDs for selected drawables.
    public selectedDrawables: IDrawable[] | null = null;
    private hoveredDrawable: IDrawable | null = null;

    private isDragging: boolean = false;
    private dragStart: Position = new Position(null, null);
    private dragCurrent: Position = new Position(null, null);

    private isResizing: boolean = false;
    private resizeStart: Position = new Position(null, null);
    private resizeCurrent: Position = new Position(null, null);

    public isDrawingShape: boolean = false;
    private addShapePosition: Position = new Position(null, null);
    private shapeToAddId: string = "";
    private selectionBox: MassSelectionBox | null = null;

    private dragOffset: Position = new Position(null, null);
    public drawables: IDrawable[] = [];
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private viewport: Viewport;
    public shapesButtonActivated: boolean = false;
    public textButtonActivated: boolean = false;


    constructor(canvas: HTMLCanvasElement,
        ctx: CanvasRenderingContext2D,
        viewport: Viewport) {
        this.ctx = ctx;
        this.canvas = canvas;

        this.viewport = viewport;
    }

    //#region Drawing methods
    public startDrawing(mouseGridPos: Position): void {
        this.addShapePosition = mouseGridPos;
        this.isDrawingShape = true;
    }

    public updateDrawing(mouseGridPos: Position, scale: number): void {
        if (this.isDrawingShape) {
            // Calculate the different between the start position and the current mouse position to determine the width and height
            const diffX = mouseGridPos.x! - this.addShapePosition.x!;
            const diffY = mouseGridPos.y! - this.addShapePosition.y!;

            // Calculate the width and height of the new shape
            const width = Math.abs(diffX);
            const height = Math.abs(diffY);

            if (this.shapeToAddId == "") {
                this.shapeToAddId = uuidv4();

                let shapeToAdd = new Box(this.shapeToAddId,
                    width, height, '#e4bf1aff',
                    this.addShapePosition.x!, this.addShapePosition.y!, true);

                shapeToAdd.draw(this.ctx, scale, null);
                this.drawables.push(shapeToAdd);

                this.selectedDrawables = [shapeToAdd];
            }

            const foundDrawable = this.drawables.find(d => d.ID === this.shapeToAddId);
            if (foundDrawable) {
                foundDrawable.lastMousePosition = CanvasPosition.BottomRightCorner;
                foundDrawable!.resize(mouseGridPos, foundDrawable.lastMousePosition, false, null, null);
            }

        }
    }

    public stopDrawing(): void {
        if (this.isDrawingShape) {
            this.shapesButtonActivated = false;
            this.isDrawingShape = false;
            this.shapeToAddId = "";
        }
    }

    // #endregion


    // #region Dragging methods
    public startDragging(mouseGridPos: Position): void {
        this.isDragging = true;
        this.isResizing = false;

        this.dragStart = mouseGridPos;
        this.dragCurrent = mouseGridPos;
    }

    public updateDrag(mouseGridPos: Position): void {

        const deltaX = mouseGridPos.x! - this.dragCurrent.x!;
        const deltaY = mouseGridPos.y! - this.dragCurrent.y!;

        this.dragCurrent = mouseGridPos;

        if (this.isDragging && this.selectedDrawables &&
            mouseGridPos.x !== null && mouseGridPos.y !== null) {

            this.selectedDrawables.forEach((drawable: IDrawable) => {
                // Add only the delta since last frame
                drawable.gridPosition.x = drawable.gridPosition.x! + deltaX;
                drawable.gridPosition.y = drawable.gridPosition.y! + deltaY;

                drawable.screenPosition = this.viewport.convertToScreenPos(drawable.gridPosition);
            });
        }
    }

    public stopDragging(): void {
        this.isDragging = false;
        this.dragStart = new Position(null, null);
        this.dragCurrent = new Position(null, null);
    }

    //#endregion


    // #region Selction methods
    public trySelectAt(mouseGridPos: Position): boolean {

        // First, look to see if you are on the select box.
        if (this.selectionBox) {
            let mousePosOnDrawable = this.selectionBox.getMousePosOnDrawable(mouseGridPos);
            if (mousePosOnDrawable != CanvasPosition.NotOn) {
                return true;
            }
        }

        // If you are not on the select box, check to see if you are on any of the drawables.
        for (let i = this.drawables.length - 1; i >= 0; i--) {
            const drawable = this.drawables[i];
            let mousePosOnDrawable = drawable.getMousePosOnDrawable(mouseGridPos);
            if (mousePosOnDrawable != CanvasPosition.NotOn) {
                this.clearSelection();
                this.selectDrawable(drawable, mouseGridPos);
                return true;
            }
        }

        return false;
    }

    public setSelectedDrawables(selectedDrawables: IDrawable[]): void {
        this.selectedDrawables = selectedDrawables;
    }

    public selectDrawable(drawable: IDrawable, mouseGridPos: Position): void {
        this.selectedDrawables = [drawable];

        this.dragOffset.x = mouseGridPos.x! - drawable.gridPosition.x!;
        this.dragOffset.y = mouseGridPos.y! - drawable.gridPosition.y!;
    }

    public clearSelection(): void {
        this.selectedDrawables = null;
    }

    public getMouseCanvasPosition(gridPos: Position): number {

        // First see if you are on the select box.
        if (this.selectionBox) {
            let position = this.selectionBox.getMousePosOnDrawable(gridPos);

            if (position != CanvasPosition.NotOn) {
                return position;
            }
        }

        if (this.selectedDrawables != null) {
            if (this.selectedDrawables!.length === 1) {
                return this.selectedDrawables[0].getMousePosOnDrawable(gridPos);
            }
        }

        return CanvasPosition.NotOn;

    }

    public setMassSelectedDrawables(drawables: IDrawable[]): void {
        this.selectedDrawables = drawables;

        this.selectionBox = null;
    }

    private drawMassSelectionBoxAround(scale: number): void {
        if (this.selectedDrawables == null) {
            return;
        }

        this.selectionBox = this.createMassSelectionBox(this.selectedDrawables!);
        this.selectionBox.draw(this.ctx, scale, null);
    }

    private createMassSelectionBox(drawables: IDrawable[]): MassSelectionBox {
        const allPoints = drawables.flatMap(d => d.points);

        const minX = Math.min(...allPoints.map(p => p.x!));
        const maxX = Math.max(...allPoints.map(p => p.x!));
        const minY = Math.min(...allPoints.map(p => p.y!));
        const maxY = Math.max(...allPoints.map(p => p.y!));

        //console.log(`minX: ${minX}, maxX: ${maxX}, minY: ${minY}, maxY: ${maxY}`);

        // Width/height calculation
        const width = maxX - minX;
        const height = maxY - minY;

        let massSelectionBox = new MassSelectionBox(uuidv4(), width, height, 'rgba(0, 0, 255, 0.05)', minX, minY, true);

        return massSelectionBox;
    }
    // #endregion


    // #region Resizing methods
    public startResizing(resizeStart: Position): void {
        this.isResizing = true;
        this.isDragging = false;

        this.resizeStart = resizeStart;

        this.selectedDrawables!.forEach(drawable => {
            drawable.originalDimensions = {
                x: drawable.gridPosition.x!,
                y: drawable.gridPosition.y!,
                width: drawable.width,
                height: drawable.height
            }
        });
    }

    public updateResizing(mouseGridPos: Position): void {
        if (this.isResizing && this.selectedDrawables &&
            mouseGridPos.x !== null && mouseGridPos.y !== null) {
            this.selectedDrawables.forEach(drawable => {
                drawable.gridPosition.x = mouseGridPos.x! - this.dragOffset.x!;
                drawable.gridPosition.y = mouseGridPos.y! - this.dragOffset.y!;
            });

        }
    }

    public stopResizing(): void {
        this.isResizing = false;
    }

    public resizeSelected(mouseGridPosition: Position, mouseCanvasPosition: number): void {

        if (this.selectedDrawables == null) {
            return;
        }

        // If there is only one selected, use the resize method on it. 
        if (this.selectedDrawables!.length == 1) {
            this.selectedDrawables![0].resize(mouseGridPosition, mouseCanvasPosition, false, null, null);
        }
        else {
            // TODO: Implement logic for resizing when there are multiple drawables selected. 
            //throw new Error("Resizing logic not implemented for multiple selected drawables.");



            const deltaX = mouseGridPosition.x! - this.resizeStart!.x!;
            const deltaY = mouseGridPosition.y! - this.resizeStart!.y!;

            console.log(`deltaX: ${deltaX}, deltaY: ${deltaY}`);

            this.resizeCurrent = mouseGridPosition;

            this.selectedDrawables.forEach(drawable => {
                const original = drawable.originalDimensions!;
                drawable.resize(this.resizeCurrent, mouseCanvasPosition, true, new Position(deltaX, deltaY), original);
            });
        }
    }

    // #endregion


    // #region Adding methods

    public addDrawables(drawables: IDrawable[]): void {
        this.drawables = this.drawables.concat(drawables);
    }

    public addDrawable(mouseGridPos: Position): void {
        const boxSize = 200;
        const sizeOffset = 200 / 2;
        let createdDrawable = new Box('new-box', boxSize, boxSize, '#5c9dffff', mouseGridPos.x! - sizeOffset!, mouseGridPos.y! - sizeOffset!);
        createdDrawable.isSelected = true;
        this.selectedDrawables = [createdDrawable];
        this.drawables.push(createdDrawable);
    }

    //#endregion


    // #region Deleting methods

    public deleteSelected(): void {
        if (this.selectedDrawables == null) {
            return;
        }

        this.removeDrawables(this.selectedDrawables!);
        this.selectedDrawables = null;
    }

    private removeDrawables(drawables: IDrawable[]): void {
        this.drawables = this.drawables.filter((drawable: IDrawable) => !drawables.includes(drawable));
    }

    //#endregion

    // #region Text methods


    //#endregion


    // #region Rendering methods

    public render(viewport: Viewport, canvas: HTMLCanvasElement,
        selectBoxManager: SelectBoxManager, mouseGridPos: Position,
        zoom: number): void {
        this.clear(canvas.width, canvas.height);

        this.ctx.save();
        this.ctx.translate(viewport.panX, viewport.panY);
        this.ctx.scale(viewport.scale, viewport.scale);

        // draw the background pattern
        this.drawBackground(this.ctx, canvas);

        this.drawObjects(this.ctx, viewport, this.canvas, selectBoxManager, mouseGridPos, zoom);

        this.ctx.restore();
    }

    public clear(width: number, height: number): void {
        this.ctx.clearRect(0, 0, width, height);
    }

    public drawObjects(ctx: CanvasRenderingContext2D, viewport: Viewport, canvas: HTMLCanvasElement,
        selectBoxManager: SelectBoxManager, mouseGridPos: Position,
        zoom: number): void {
        this.drawables.forEach((drawable: IDrawable) => {
            const screenPosition: Position = viewport.convertToScreenPos(drawable.gridPosition);

            // If we are drawing the select box, draw it.
            if (selectBoxManager.isDrawing) {
                selectBoxManager.drawSelectBox(mouseGridPos);
            }

            // console.log('The drawables selected are:');
            // console.log(this.selectedDrawables);

            drawable.updateScreenPosition(screenPosition);
            drawable.draw(ctx, zoom, null);
        });

        // Draw the boxes around the selected drawables.
        if (this.selectedDrawables != null) {
            this.drawMassSelectionBoxAround(viewport.scale);
        }
    }

    private drawBackground(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement): void {
        const gridSize = 30; // Distance between dots in grid units
        const dotRadius = 1.5; // Dot size in grid units

        const startX = Math.floor(-ctx.getTransform().e / ctx.getTransform().a / gridSize) * gridSize;
        const startY = Math.floor(-ctx.getTransform().f / ctx.getTransform().d / gridSize) * gridSize;
        const endX = startX + (canvas.width / ctx.getTransform().a) + gridSize;
        const endY = startY + (canvas.height / ctx.getTransform().d) + gridSize;

        ctx.fillStyle = '#d8d8d8ff';

        // Draw dots in a grid
        for (let x = startX; x <= endX; x += gridSize) {
            for (let y = startY; y <= endY; y += gridSize) {
                ctx.beginPath();
                ctx.arc(x, y, dotRadius, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }

    //#endregion


    // #region Button methods
    public setShapesButton(state: boolean): void {
        this.shapesButtonActivated = state;
    }

    public setTextButton(state: boolean): void {
        this.textButtonActivated = state;
    }

    // #endregion


    // #region Utility methods
    public getDrawableById(id: string): IDrawable | null {
        return this.drawables.find((drawable: IDrawable) => drawable.ID === id) || null;
    }

    // #endregion

}