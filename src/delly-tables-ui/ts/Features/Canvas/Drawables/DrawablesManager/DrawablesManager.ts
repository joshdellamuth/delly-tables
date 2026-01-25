import { CanvasPosition } from '../../Shared/CanvasPosition.ts';
import { IDrawable } from '../IDrawable.ts';
import { Viewport } from '../../InputManager/Viewport/Viewport.ts';
import { Position } from '../../Shared/Position.ts';
import { Box } from '../Box/Box.ts';
import { ISelectBoxManager } from '../../InputManager/SelectBoxManager/SelectBoxManager.ts';
import { MassSelectionBox } from '../MassSelectionBox/MassSelectionBox.ts';
import { v4 as uuidv4 } from 'uuid';
import { TextDrawable } from '../TextDrawable.ts';

// #region Interface
export interface IDrawablesManager {
    selectedDrawables: IDrawable[] | null;
    drawables: IDrawable[];

    deleteSelected(): void;

    addDrawables(drawables: IDrawable[]): void;
    addDrawable(mouseGridPos: Position): void;

    startDrawing(mouseGridPos: Position): void;
    updateDrawing(mouseGridPos: Position, scale: number): void;
    stopDrawing(): void;

    startDragging(mouseGridPos: Position): void;
    updateDrag(mouseGridPos: Position): void;
    stopDragging(): void;

    startResizing(mouseGridPos: Position): void;
    updateResizing(mouseGridPos: Position): void;
    stopResizing(): void;
    resizeSelected(mouseGridPosition: Position, mouseCanvasPosition: number): void;

    trySelectAt(mouseGridPos: Position): boolean;
    setSelectedDrawables(drawables: IDrawable[]): void;
    selectDrawable(drawable: IDrawable, mouseGridPos: Position): void;
    clearSelection(): void;

    getMouseCanvasPosition(gridPos: Position): number;

    // Text
    addText(text: string): void;
    removeCharacter(): void;
    setTextPosition(textGridPosition: Position | null): void;
    blinkCursor(): void;
    showCursor(): void;
    hideCursor(): void;
    getTextPositon(): Position | null;

    // Buttons 
    setShapesButton(state: boolean): void;
    setTextButton(state: boolean): void;
    setAnnotateButton(state: boolean): void;

    render(viewport: Viewport, canvas: HTMLCanvasElement,
        selectBoxManager: ISelectBoxManager, mouseGridPos: Position,
        zoom: number): void;
}
// #endregion

export class DrawablesManager implements IDrawablesManager {
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
    public annotateButtonActivated: boolean = false;

    private addTextPosition: Position | null = null;
    private isBlinkingCursor: boolean = false;
    private isCursorShowing: boolean = false;


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
                    this.addShapePosition.x!, this.addShapePosition.y!);

                shapeToAdd.draw(this.ctx, scale);
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

    public setSelectedDrawables(drawables: IDrawable[]): void {
        this.selectedDrawables = drawables;

        this.selectionBox = null;
    }

    private drawSelectionBoxAround(scale: number): void {
        if (this.selectedDrawables == null) {
            return;
        }

        this.selectionBox = this.createMassSelectionBox(this.selectedDrawables!);
        this.selectionBox.draw(this.ctx, scale);
    }

    private createMassSelectionBox(drawables: IDrawable[]): MassSelectionBox {
        const allPoints = drawables.flatMap(d => d.points);

        const minX = Math.min(...allPoints.map(p => p.x!));
        const maxX = Math.max(...allPoints.map(p => p.x!));
        const minY = Math.min(...allPoints.map(p => p.y!));
        const maxY = Math.max(...allPoints.map(p => p.y!));

        // Width/height calculation
        const width = maxX - minX;
        const height = maxY - minY;

        let massSelectionBox = new MassSelectionBox(uuidv4(), width, height, 'rgba(0, 0, 255, 0.05)', minX, minY);

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
        this.selectedDrawables = [createdDrawable];
        this.drawables.push(createdDrawable);
        this.drawSelectionBoxAround(this.viewport.scale);
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

    addText(character: string): void {
        // Temporarily hard coded character width.
        // TODO: Fix this.

        // Set the font size and font. 
        this.ctx.font = '40px Arial';

        const metrics = this.ctx.measureText(character);
        const characterWidth = metrics.width;

        if (this.selectedDrawables) {

            // if there are multiple drawables selected, return. 
            if (this.selectedDrawables.length > 1) {
                return;
            }

            // If what is selected is a text drawable add text to it.
            if (this.selectedDrawables[0] instanceof TextDrawable) {
                this.selectedDrawables[0].addCharacter(character);

                this.addTextPosition!.x! = this.addTextPosition!.x! + characterWidth;
                return;
            }
        }
        else {
            // If there are no drawables selected, create a new text drawable and select it. 
            if (this.addTextPosition != null) {
                const fontSpec = this.ctx.font; // e.g. "16px Arial"
                // Parse the int into base 10 
                const fontSize = parseInt(fontSpec, 10); // 16

                let text = new TextDrawable(this.ctx, '40px Arial', this.addTextPosition.x!, this.addTextPosition.y!, 5, fontSize);
                text.addCharacter(character);
                this.drawables.push(text);
                this.addTextPosition.x! = this.addTextPosition.x! + characterWidth;

                this.selectedDrawables = [text];
            }
        }
    }

    public removeCharacter(): void {

        this.ctx.font = '40px Arial';

        if (this.selectedDrawables) {
            // if there are multiple drawables selected, return. 
            if (this.selectedDrawables.length > 1) {
                return;
            }

            // If what is selected is a text drawable add text to it.
            if (this.selectedDrawables[0] instanceof TextDrawable) {
                let characterWidth = this.selectedDrawables[0].getCharWidthAtCursor();

                if (characterWidth == null) {
                    throw new Error('Character width is null');
                }

                this.selectedDrawables[0].removeText();
                this.addTextPosition!.x! = this.addTextPosition!.x! - characterWidth;
                return;
            }
        }
    }

    public setTextPosition(addTextGridPosition: Position | null): void {
        this.addTextPosition = addTextGridPosition;
    }

    public blinkCursor(): void {
        this.isBlinkingCursor = !this.isBlinkingCursor;
    }

    public showCursor(): void {
        this.isCursorShowing = true;
    }

    public hideCursor(): void {
        this.isCursorShowing = false;
    }

    // Used in the render method to draw the actual 
    private drawCursor(): void {
        if (this.isCursorShowing) {
            this.ctx.beginPath();

            console.log(`font spec`);

            console.log(this.ctx.font);

            if (this.addTextPosition != null) {
                this.ctx.rect(
                    this.addTextPosition!.x!,
                    this.addTextPosition!.y!,
                    3,
                    40
                );
            }

            this.ctx.fillStyle = 'black';
            this.ctx.fill(); // fill it in instead of stroke
        }
    }

    public getTextPositon(): Position | null {
        return this.addTextPosition;
    }

    //#endregion


    // #region Rendering methods

    public render(viewport: Viewport, canvas: HTMLCanvasElement,
        selectBoxManager: ISelectBoxManager, mouseGridPos: Position,
        zoom: number): void {
        this.clear(canvas.width, canvas.height);

        this.ctx.save();
        this.ctx.translate(viewport.panX, viewport.panY);
        this.ctx.scale(viewport.scale, viewport.scale);

        // draw the background pattern
        this.drawBackground(this.ctx, canvas);

        this.drawObjects(this.ctx, viewport, this.canvas, selectBoxManager, mouseGridPos, zoom);

        if (this.isCursorShowing) {
            if (this.isBlinkingCursor) {
                this.drawCursor();
            }
        }


        this.ctx.restore();
    }

    private clear(width: number, height: number): void {
        this.ctx.clearRect(0, 0, width, height);
    }

    private drawObjects(ctx: CanvasRenderingContext2D, viewport: Viewport, canvas: HTMLCanvasElement,
        selectBoxManager: ISelectBoxManager, mouseGridPos: Position,
        zoom: number): void {
        this.drawables.forEach((drawable: IDrawable) => {
            const screenPosition: Position = viewport.convertToScreenPos(drawable.gridPosition);

            // If we are drawing the select box, draw it.
            if (selectBoxManager.isDrawing) {
                selectBoxManager.drawSelectBox(mouseGridPos);
            }

            drawable.updateScreenPosition(screenPosition);
            drawable.draw(ctx, zoom);
        });

        // Draw the boxes around the selected drawables.
        if (this.selectedDrawables != null) {
            this.drawSelectionBoxAround(viewport.scale);
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
        console.log('Text button activated with state: ' + this.textButtonActivated);
    }

    public setAnnotateButton(state: boolean): void {
        this.annotateButtonActivated = state;
        console.log('Annotate button activated with state: ' + this.annotateButtonActivated);
    }

    // #endregion


    // #region Utility methods
    private getDrawableById(id: string): IDrawable | null {
        return this.drawables.find((drawable: IDrawable) => drawable.ID === id) || null;
    }

    // #endregion

}