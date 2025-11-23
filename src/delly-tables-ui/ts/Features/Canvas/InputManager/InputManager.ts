import { Position } from '../Shared/Position.ts';
import { Viewport } from './Viewport/Viewport.ts';
import { DrawablesManager } from '../Drawables/DrawablesManager/DrawablesManager.ts';
import { CanvasPosition } from '../Shared/CanvasPosition.ts';
import { Mouse } from '../InputManager/Mouse/Mouse.ts';
import { IDrawable } from '../Drawables/IDrawable.ts';
import { IInputManager } from './IInputManager.ts';
import { SelectBoxManager } from './SelectBoxManager/SelectBoxManager.ts';
import { InputStates } from './InputStates.ts';

export class InputManager implements IInputManager {
    private mouseScreenPos: Position = new Position(null, null);
    private mouseGridPos: Position = new Position(null, null);
    private isPanning: boolean = false;
    private panStart: Position = new Position(null, null);
    private canvas: HTMLCanvasElement;
    private drawablesManager: DrawablesManager;
    public selectBoxManager: SelectBoxManager;
    private ctx: CanvasRenderingContext2D;
    private viewport: Viewport = new Viewport();
    private mouse: Mouse;
    private mouseCanvasPosition: number = CanvasPosition.NotOn;
    private inputState: number = InputStates.Idle;


    // Buttons
    private shapesButton: HTMLButtonElement;

    get mouseScreenPosition(): Position { return this.mouseScreenPos; }
    get mouseGridPosition(): Position { return new Position(this.mouseGridPos.x, this.mouseGridPos.y); }
    get isPanningActive(): boolean { return this.isPanning; }

    public constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, shapesButton: HTMLButtonElement) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.shapesButton = shapesButton;
        this.drawablesManager = new DrawablesManager(canvas, ctx);
        this.selectBoxManager = new SelectBoxManager(ctx, canvas);
        this.mouse = new Mouse(this.canvas);

        this.setupEventListeners();
        this.addButtonListeners();
    }

    public addDrawables(drawables: IDrawable[]): void {
        this.drawablesManager.addDrawables(drawables);
        this.render();
    }

    public setupEventListeners(): void {
        // Put all of these into the input manager. 
        this.canvas.addEventListener('contextmenu', e => e.preventDefault());

        // .bind(this) locks the function’s this to your class instance
        this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
        this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
        this.canvas.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
        this.canvas.addEventListener('wheel', this.handleWheel.bind(this));
        this.canvas.addEventListener('dblclick', this.handleDoubleClick.bind(this));
        // Must add the event on the window because canvas is not focusable bys default. 
        window.addEventListener('keydown', this.handleKeyDown.bind(this));
    }

    handleKeyDown(e: KeyboardEvent): void {
        if (e.key === 'Delete') {
            this.drawablesManager.deleteSelected();
        }

        this.render();
    }

    private handleMouseDown(e: MouseEvent): void {
        // LEFT CLICK LOGIC
        if (e.button === 0) {

            // switch case for state here
            switch (this.inputState) {
                case InputStates.Idle:
                    let isSelected = this.drawablesManager.trySelectAt(this.mouseGridPosition);

                    // If anything was selected using "trySelectAt"
                    if (isSelected) {

                        this.mouseCanvasPosition = this.drawablesManager.getMouseCanvasPosition(this.mouseGridPos);

                        if (this.mouseCanvasPosition === CanvasPosition.Inside) {
                            this.mouse.setStyleByHoveringStatus(this.mouseCanvasPosition);
                            this.inputState = InputStates.Dragging;
                            this.drawablesManager.startDragging();
                        }
                        else {
                            if (this.mouseCanvasPosition! != CanvasPosition.NotOn) {
                                this.inputState = InputStates.Resizing;
                                this.drawablesManager.startResizing();
                            }

                        }
                    }
                    // If nothing was selected, clear the previous selections and start drawing the selection box.
                    else {
                        // Clear all other selections
                        this.drawablesManager.clearSelection();
                        this.selectBoxManager.startSelectBox(this.mouseGridPosition);
                        this.inputState = InputStates.Selecting;
                    }

                    break;
                case InputStates.Selecting:
                    break;
                case InputStates.Panning:
                    break;
                case InputStates.Drawing:
                    this.drawablesManager.startDrawing(this.mouseGridPosition);
                    // Clear the currently selected shapes. (the one that is being drawn will be selected.)
                    this.drawablesManager.clearSelection();
                    break;
                case InputStates.Resizing:
                    break;
                default:
                    break;
            }

            this.render();
        }

        // RIGHT CLICK LOGIC
        if (e.button === 2) {
            this.startPanning(e.clientX, e.clientY);
            this.mouse.setStyleGrab();
            this.inputState = InputStates.Panning;
        }
    }


    private handleDoubleClick(e: MouseEvent): void {
        this.drawablesManager.clearSelection();
        const onObject = this.drawablesManager.trySelectAt(this.mouseGridPosition);

        if (onObject) {
            return;
        }

        this.drawablesManager.addDrawable(this.mouseGridPosition);

        this.render();
    }

    private handleMouseMove(e: MouseEvent): void {

        // When you move the mouse, update the mouse position.
        this.updateMousePosition(this.canvas, e.clientX,
            e.clientY, this.viewport);

        // Update the input state. 
        switch (this.inputState) {
            case InputStates.Idle:
                this.mouseCanvasPosition = this.drawablesManager.getMouseCanvasPosition(this.mouseGridPos);
                this.mouse.setStyleByHoveringStatus(this.mouseCanvasPosition);
                break;
            case InputStates.Selecting:
                break;
            case InputStates.Panning:
                this.mouse.setStyleGrabbing();
                const { deltaX, deltaY } = this.updatePanning(e.clientX, e.clientY);
                this.viewport.pan(deltaX, deltaY);
                break;
            case InputStates.Dragging:
                this.drawablesManager.updateDrag(this.mouseGridPosition);
                break;
            case InputStates.Resizing:
                this.drawablesManager.resizeSelected(this.mouseGridPosition, this.mouseCanvasPosition);
                break;
            case InputStates.Drawing:
                this.drawablesManager.updateDrawing(this.mouseGridPosition);
                break;
            default:
                break;
        }

        this.render();
    }

    private handleMouseUp(): void {
        switch (this.inputState) {
            case InputStates.Idle:
                break;
            case InputStates.Selecting:
                // Set the selected drawables to the drawables in the select box.             
                let selectedDrawables = this.selectBoxManager.getDrawablesInSelectBox(this.drawablesManager.drawables);
                this.drawablesManager.setSelectedDrawables(selectedDrawables);

                this.selectBoxManager.stopSelectBox();
                this.cancel();
                break;
            case InputStates.Panning:
                this.stopPanning();
                this.cancel();
                break;
            case InputStates.Dragging:
                this.drawablesManager.stopDragging();
                this.cancel();
                break;

            case InputStates.Resizing:
                this.drawablesManager.stopResizing();
                this.cancel();
                break;

            case InputStates.Drawing:
                this.drawablesManager.stopDrawing();
                this.toggleShapesButton();
                this.cancel();
                break;

            default:
                break;
        }


    }

    private handleMouseLeave(): void {
        // Continue dragging even when the user's mouse leaves the canvas. 
    }

    public updateMousePosition(canvas: HTMLCanvasElement, clientX: number, clientY: number, viewport: Viewport): void {
        const rect = canvas.getBoundingClientRect();
        this.mouseScreenPos.x = clientX - rect.left;
        this.mouseScreenPos.y = clientY - rect.top;

        const gridPos: Position = viewport.screenToGrid(
            new Position(this.mouseScreenPos.x, this.mouseScreenPos.y));

        this.mouseGridPos.x = gridPos.x;
        this.mouseGridPos.y = gridPos.y;
    }

    public startPanning(clientX: number, clientY: number): void {
        this.isPanning = true;
        this.panStart.x = clientX;
        this.panStart.y = clientY;
    }

    private handleWheel(e: WheelEvent): void {
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        this.viewport.zoom(e.deltaY, mouseX, mouseY);
        this.render();
    }


    private cancel(): void {
        this.inputState = InputStates.Idle;
        this.mouse.setStyleDefault();
    }

    // #region Panning methods
    public stopPanning(): void {
        this.isPanning = false;
        this.panStart.x = null;
        this.panStart.y = null;
    }

    public updatePanning(clientX: number, clientY: number): { deltaX: number, deltaY: number } {
        if (!this.isPanning || this.panStart.x === null || this.panStart.y === null) {
            return { deltaX: 0, deltaY: 0 };
        }

        const deltaX = clientX - this.panStart.x;
        const deltaY = clientY - this.panStart.y;

        this.panStart.x = clientX;
        this.panStart.y = clientY;

        return { deltaX, deltaY };
    }

    // #endregion

    // Rendering all of the drawables. 
    public render(): void {
        this.drawablesManager.render(this.viewport, this.canvas, this.selectBoxManager, this.mouseGridPosition);
    }


    // #region Button listeners

    private addButtonListeners(): void {
        // Guard clause for shapes button
        if (!this.shapesButton) {
            console.error("Shapes button not found in DOM");
            return;
        }

        this.shapesButton.addEventListener('click', () => {
            this.toggleShapesButton();
            this.mouse.setStyleCrosshair();
        });
    }

    // #endregion


    // #region Toggling the buttons

    public toggleShapesButton(): void {
        // If the state was drawing, toggle the shapes button.
        if (this.inputState === InputStates.Drawing) {
            this.drawablesManager.setShapesButton(false);
            this.shapesButton.classList.remove('active');
        }
        else {
            // Otherwise, toggle the shapes button to true and set the input state. 
            this.drawablesManager.setShapesButton(true);
            this.inputState = InputStates.Drawing;
            this.shapesButton.classList.add('active');
        }

    }

    // #endregion
}