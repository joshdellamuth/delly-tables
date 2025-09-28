import { Camera } from './Camera/Camera.js';
import { InputManager } from './InputManager/InputManager.js';
import { SelectionManager } from './SelectionManager/SelectionManager.js';
import { Size } from './Shared/Size.js';
import { CanvasObjects } from './Drawables/CanvasDrawables.js';
import { Renderer } from './Renderer/Renderer.js';

export class InfiniteCanvas {
    private readonly ID: string;
    private readonly canvas: HTMLCanvasElement;
    private readonly renderer: Renderer;
    private readonly camera: Camera = new Camera();
    private readonly inputManager: InputManager = new InputManager();
    private readonly selectionManager: SelectionManager = new SelectionManager();
    private readonly canvasObjects: CanvasObjects = new CanvasObjects();
    private size: Size = new Size(0, 0);

constructor(ID: string, width: number, height: number, canvasObjects?: CanvasObjects) {
    this.ID = ID;
    this.canvas = document.getElementById(ID) as HTMLCanvasElement;
    const ctx = this.canvas.getContext('2d')!;
    this.renderer = new Renderer(ctx);
    
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
    
    this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
    this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
    this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
    this.canvas.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
    this.canvas.addEventListener('wheel', this.handleWheel.bind(this));
}

private handleMouseDown(e: MouseEvent): void {
    if (e.button === 0) { // Left click
        const selected = this.selectionManager.trySelectAt(
            this.canvasObjects, 
            this.inputManager.mouseGridPosition
        );
        
        if (selected) {
            this.canvas.style.cursor = 'move';
        } else {
            this.selectionManager.clearSelection(this.canvasObjects);
        }
        
        this.render();
        this.updateDebugValues();
    }
    
    if (e.button === 2) { // Right click
        this.inputManager.startPanning(e.clientX, e.clientY);
        this.canvas.style.cursor = 'grab';
    }
}

private handleMouseMove(e: MouseEvent): void {
    this.inputManager.updateMousePosition(this.canvas, e.clientX, e.clientY, this.camera);
    
    if (this.selectionManager.isDraggingShape) {
        this.selectionManager.updateDrag(this.inputManager.mouseGridPosition);
        this.render();
        this.updateDebugValues();
        return;
    }
    
    if (this.inputManager.isPanningActive) {
        this.canvas.style.cursor = 'grabbing';
        const { deltaX, deltaY } = this.inputManager.updatePanning(e.clientX, e.clientY);
        this.camera.pan(deltaX, deltaY);
    }
    
    this.render();
    this.updateDebugValues();
}

private handleMouseUp(): void {
    this.canvas.style.cursor = 'default';
    this.selectionManager.stopDragging();
    this.inputManager.stopPanning();
    this.updateDebugValues();
}

private handleMouseLeave(): void {
    this.inputManager.stopPanning();
    this.selectionManager.stopDragging();
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
    const selected = this.selectionManager.selected;
    
    element.innerText = 
        `| scale: ${this.camera.scale.toFixed(8)} ` +
        `| panX: ${this.camera.panX.toFixed(8)} ` +
        `| panY: ${this.camera.panY.toFixed(8)} ` +
        `| isPanning: ${this.inputManager.isPanningActive} ` +
        `| mouseGrid: ${mouseGrid.x?.toFixed(8) ?? 'null'}, ${mouseGrid.y?.toFixed(8) ?? 'null'} ` +
        `| mouseScreen: ${mouseScreen.x?.toFixed(8) ?? 'null'}, ${mouseScreen.y?.toFixed(8) ?? 'null'} ` +
        `| selected: '${selected?.ID ?? 'none'}' |`;
}
}