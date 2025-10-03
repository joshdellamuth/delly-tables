import { Camera } from './Camera/Camera.js';
import { Mouse } from './Mouse/Mouse.js';
import { InputManager } from './InputManager/InputManager.js';
import { DrawablesManager } from './DrawablesManager/DrawablesManager.js';
import { Size } from './Shared/Size.js';
import { CanvasDrawables } from './Drawables/CanvasDrawables.js';
import { PositionOnDrawable } from './Drawables/PositionOnDrawable.js';
import { Renderer } from './Renderer/Renderer.js';

export class InfiniteCanvas {
    private readonly ID: string;
    private readonly canvas: HTMLCanvasElement;
    private readonly renderer: Renderer;
    private readonly camera: Camera = new Camera();
    private readonly mouse: Mouse;
    private readonly inputManager: InputManager = new InputManager();
    private readonly drawablesManager: DrawablesManager = new DrawablesManager();
    private readonly canvasObjects: CanvasDrawables = new CanvasDrawables();
    private size: Size = new Size(0, 0);

    constructor(ID: string, width: number, height: number, canvasObjects?: CanvasDrawables) {
        this.ID = ID;
        this.canvas = document.getElementById(ID) as HTMLCanvasElement;
        const ctx = this.canvas.getContext('2d')!;
        this.renderer = new Renderer(ctx);
        this.mouse = new Mouse(this.canvas);
        this.updateSize(width, height);

        if (canvasObjects) {
            this.canvasObjects = canvasObjects;
        }

        this.setupEventListeners();
        this.render();
        this.updateDebugValues();
    }

    private render(): void {
        this.renderer.render(this.canvasObjects, this.camera, this.canvas);
    }

    private setupEventListeners(): void {
        this.canvas.addEventListener('contextmenu', e => e.preventDefault());

        // .bind(this) locks the function’s this to your class instance
        this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
        this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
        this.canvas.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
        this.canvas.addEventListener('wheel', this.handleWheel.bind(this));
    }

    private handleMouseDown(e: MouseEvent): void {
        if (e.button === 0) { // Left click
            const selected = this.drawablesManager.trySelectAt(
                this.canvasObjects,
                this.inputManager.mouseGridPosition
            );

            if (selected) {
                this.mouse.setStyleMove();
            } else {
                this.drawablesManager.clearSelection(this.canvasObjects);
            }

            if (this.drawablesManager.selected != null) {
                let selectedDrawable = this.drawablesManager.selected;
                let mousePosition = this.inputManager.mouseGridPosition;
                if (selectedDrawable?.isMouseOver(mousePosition)) {
                    if (selectedDrawable.lastMousePosition === PositionOnDrawable.Inside) {
                        this.drawablesManager.startDragging();
                    }
                    else if (selectedDrawable.lastMousePosition === PositionOnDrawable.NotOn) {
                        
                    }
                    else {
                        this.drawablesManager.startResizing();
                    }
                }
            }
            
            this.render();
            this.updateDebugValues();
        }

        if (e.button === 2) { // Right click
            this.inputManager.startPanning(e.clientX, e.clientY);
            this.mouse.setStyleGrab();
        }
    }

    private handleMouseMove(e: MouseEvent): void {
        this.inputManager.updateMousePosition(this.canvas, e.clientX, e.clientY, this.camera);

        if (this.drawablesManager.isDraggingShape) {
            this.drawablesManager.updateDrag(this.inputManager.mouseGridPosition);
            this.render();
            this.updateDebugValues();
            return;
        }

        if (this.inputManager.isPanningActive) {
            this.mouse.setStyleGrabbing();
            const { deltaX, deltaY } = this.inputManager.updatePanning(e.clientX, e.clientY);
            this.camera.pan(deltaX, deltaY);
        }

        let selectedDrawable = this.drawablesManager.selected;
        let mousePosition = this.inputManager.mouseGridPosition;

        if (selectedDrawable != null) {
            let hoveringStatus = selectedDrawable.getHoveringState(this.inputManager.mouseGridPosition);
            this.mouse.setStyleByHoveringStatus(hoveringStatus);
            console.log('The hovering status is: ', hoveringStatus);
            console.log('Last position is: ', hoveringStatus);

            if (this.drawablesManager.isResizingShape) {
                selectedDrawable.resize(mousePosition);
                this.render();
                this.updateDebugValues();
            }
        }

        this.render();
        this.updateDebugValues();
    }

    private handleMouseUp(): void {
        this.mouse.setStyleDefault();;
        this.drawablesManager.stopDragging();
        this.inputManager.stopPanning();
        this.drawablesManager.stopResizing();
        this.updateDebugValues();
    }

    private handleMouseLeave(): void {
        this.inputManager.stopPanning();
        this.drawablesManager.stopDragging();
        this.updateDebugValues();
    }

    private handleWheel(e: WheelEvent): void {
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        this.camera.zoom(e.deltaY, mouseX, mouseY);
        this.render();
        this.updateDebugValues();
    }

    updateSize(width: number, height: number): void {
        this.size.width = width;
        this.size.height = height;
        this.canvas.width = this.size.width;
        this.canvas.height = this.size.height;
    }

    private updateDebugValues(): void {
        const element = document.getElementById('debuggingValues') as HTMLParagraphElement;
        if (!element) return;

        const mouseGrid = this.inputManager.mouseGridPosition;
        const mouseScreen = this.inputManager.mouseScreenPosition;
        const selected = this.drawablesManager.selected;
        element.innerText =
            `| scale: ${this.camera.scale.toFixed(8)} ` +
            `| panX: ${this.camera.panX.toFixed(8)} ` +
            `| panY: ${this.camera.panY.toFixed(8)} ` +
            `| isPanning: ${this.inputManager.isPanningActive} ` +
            `| mouseGrid: ${mouseGrid.x?.toFixed(8) ?? 'null'}, ${mouseGrid.y?.toFixed(8) ?? 'null'} ` +
            `| mouseScreen: ${mouseScreen.x?.toFixed(8) ?? 'null'}, ${mouseScreen.y?.toFixed(8) ?? 'null'} ` +
            `| selected: '${selected?.ID ?? 'none'}.'` +
            `| dragging: '${this.drawablesManager.isDraggingShape ?? 'none'}.'` +
            `| resizing: ${this.drawablesManager.isResizingShape} |`;
    }
}