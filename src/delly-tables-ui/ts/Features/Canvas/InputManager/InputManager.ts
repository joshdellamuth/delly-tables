import { Position } from '../Shared/Position.ts';
import { Viewport } from './Viewport/Viewport.ts';
import { DrawablesManager } from '../Drawables/DrawablesManager/DrawablesManager.ts';
import { PositionOnDrawable } from '../Shared/PositionOnDrawable.ts';
import { Mouse } from '../InputManager/Mouse/Mouse.ts';
import { IDrawable } from '../Drawables/IDrawable.ts';
import { IInputManager } from './IInputManager.ts';
import { SelectBoxManager } from './SelectBoxManager/SelectBoxManager.ts';

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

    get mouseScreenPosition(): Position { return this.mouseScreenPos; }
    get mouseGridPosition(): Position { return new Position(this.mouseGridPos.x, this.mouseGridPos.y); }
    get isPanningActive(): boolean { return this.isPanning; }

    public constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.drawablesManager = new DrawablesManager(canvas, ctx);
        this.selectBoxManager = new SelectBoxManager(ctx, canvas);
        this.mouse = new Mouse(this.canvas);

        this.setupEventListeners();
    }

    public addDrawables(drawables: IDrawable[]): void {
        this.drawablesManager.addDrawables(drawables);
        this.render();
        this.updateDebugValues();
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
            if (this.drawablesManager.selected != null) {
                let drawables: IDrawable[] = this.drawablesManager.selected;
                this.drawablesManager.removeDrawables(drawables);
            }
        }

        this.render();
        this.updateDebugValues();
    }

    private handleMouseDown(e: MouseEvent): void {
        if (e.button === 0) { // Left click

            // In here, check if the shapes button is activated. 
            if (this.drawablesManager.shapesButtonActivated) {
                this.mouse.setStyleCrosshair();
                this.drawablesManager.startDrawing(this.mouseGridPosition);
            }

            else {
                const selected = this.drawablesManager.trySelectAt(this.mouseGridPosition);

                if (!selected) {
                    this.drawablesManager.clearSelection();
                    this.selectBoxManager.startSelectBox(this.mouseGridPosition);
                }

                // If there is already a selected shapes, see which one you are hovering over.
                if (this.drawablesManager.selected != null) {
                    let selectedHoveredDrawable = this.drawablesManager.getSelectedHoveredDrawable();

                    if (selectedHoveredDrawable != null) {
                        // Insert logic to find the hovered drawable out of the selected drawables.
                        if (selectedHoveredDrawable!.lastMousePosition === PositionOnDrawable.Inside) {
                            this.drawablesManager.startDragging();
                        }
                        else if (selectedHoveredDrawable!.lastMousePosition === PositionOnDrawable.NotOn) {

                        }
                        else {
                            this.drawablesManager.startResizing();
                        }
                    }

                }
            }

            this.render();
            this.updateDebugValues();
        }

        if (e.button === 2) { // Right click
            this.startPanning(e.clientX, e.clientY);
            this.mouse.setStyleGrab();
        }
    }

    public toggleShapesButton(): void {
        this.drawablesManager.toggleShapesButton();
    }

    private handleDoubleClick(e: MouseEvent): void {
        this.drawablesManager.clearSelection();
        const onObject = this.drawablesManager.trySelectAt(this.mouseGridPosition);

        if (onObject) {
            return;
        }

        this.drawablesManager.addDrawable(this.mouseGridPosition);

        this.render();
        this.updateDebugValues();
    }

    private handleMouseMove(e: MouseEvent): void {

        this.updateMousePosition(this.canvas, e.clientX,
            e.clientY, this.viewport);

        if (this.selectBoxManager.isDrawing) {
            this.render();
        }

        this.drawablesManager.setSelectedHoveredDrawable(this.mouseGridPosition);
        let selectedHoveredDrawable = this.drawablesManager.getSelectedHoveredDrawable();
        let mouseGridPosition = this.mouseGridPosition;

        if (this.drawablesManager.isDrawingShape) {
            this.drawablesManager.updateDrawing(this.mouseGridPosition);
            this.render();
            //this.updateDebugValues();
            return;
        }

        // If the shape is selected and we are resizing, do not get the new mouse position on the shape. Just keep resiziing it until mouse up. 
        if (selectedHoveredDrawable != null && this.drawablesManager.isResizingShape) {
            this.mouse.setStyleByHoveringStatus(selectedHoveredDrawable.lastMousePosition);
            selectedHoveredDrawable.resize(mouseGridPosition);
            this.render();
            this.updateDebugValues();
        }

        if (this.drawablesManager.isDraggingShape) {
            this.drawablesManager.updateDrag(this.mouseGridPosition);
            this.render();
            this.updateDebugValues();
            return;
        }

        if (this.isPanningActive) {
            this.mouse.setStyleGrabbing();
            const { deltaX, deltaY } = this.updatePanning(e.clientX, e.clientY);
            this.viewport.pan(deltaX, deltaY);
            this.render();

        }

        // If a shape is already selected, change the mouse accordingly, and resize it if it is being resized
        if (selectedHoveredDrawable != null && !this.drawablesManager.isResizingShape) {
            let hoveringStatus = selectedHoveredDrawable.getMousePosOnDrawable(mouseGridPosition);
            selectedHoveredDrawable.lastMousePosition = hoveringStatus;
            this.mouse.setStyleByHoveringStatus(hoveringStatus);
            this.render();
            this.updateDebugValues();
        }

        this.updateDebugValues();
    }

    private handleMouseUp(): void {

        if (this.selectBoxManager.isDrawing) {

            let selectedDrawables = this.selectBoxManager.getDrawablesInSelectBox(this.drawablesManager.drawables);

            this.drawablesManager.setSelectedDrawables(selectedDrawables);

            this.selectBoxManager.stopSelectBox();

            this.render();
        }

        else {
            this.mouse.setStyleDefault();
            this.drawablesManager.stopDragging();
            this.stopPanning();
            this.drawablesManager.stopResizing();
            this.updateDebugValues();

            this.drawablesManager.stopDrawing();

            this.selectBoxManager.stopSelectBox();
            this.render();
        }
    }

    private handleMouseLeave(): void {
        // Continue dragging even when the user's mouse leaves the canvas. 
        this.updateDebugValues();
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
        this.updateDebugValues();
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

    public render(): void {
        this.drawablesManager.render(this.viewport, this.canvas, this.selectBoxManager, this.mouseGridPosition);
    }

    public stopPanning(): void {
        this.isPanning = false;
        this.panStart.x = null;
        this.panStart.y = null;
    }

    private updateDebugValues(): void {
        const element = document.getElementById('debuggingValues') as HTMLParagraphElement;
        if (!element) return;

        const mouseGrid = this.mouseGridPosition;
        const mouseScreen = this.mouseScreenPosition;
        const selectedHovered = this.drawablesManager.getSelectedHoveredDrawable();
        element.innerText =
            `| scale: ${this.viewport.scale.toFixed(8)} ` +
            `| panX: ${this.viewport.panX.toFixed(8)} ` +
            `| panY: ${this.viewport.panY.toFixed(8)} ` +
            `| isPanning: ${this.isPanningActive} ` +
            `| mouseGrid: ${mouseGrid.x?.toFixed(8) ?? 'null'}, ${mouseGrid.y?.toFixed(8) ?? 'null'} ` +
            `| mouseScreen: ${mouseScreen.x?.toFixed(8) ?? 'null'}, ${mouseScreen.y?.toFixed(8) ?? 'null'} ` +
            `| selected: '${selectedHovered?.ID ?? 'none'}.'` +
            `| dragging: '${this.drawablesManager.isDraggingShape ?? 'none'}.'` +
            `| resizing: ${this.drawablesManager.isResizingShape} |` +
            `| selectedHoveredDrawableHoveringMousePosition: ${selectedHovered} |`;
    }
}