import { Camera } from './Camera/Camera.js';
import { InputManager } from './InputManager.js';
import { SelectionManager } from './SelectionManager.js';
import { Size } from './Size.js';
import { CanvasObjects } from '../CanvasObjects/CanvasObjects.js';
import { Renderer } from './Renderer.js';
export class InfiniteCanvas {
    constructor(ID, width, height, canvasObjects) {
        this.camera = new Camera();
        this.inputManager = new InputManager();
        this.selectionManager = new SelectionManager();
        this.canvasObjects = new CanvasObjects();
        this.size = new Size(0, 0);
        this.ID = ID;
        this.canvas = document.getElementById(ID);
        const ctx = this.canvas.getContext('2d');
        this.renderer = new Renderer(ctx);
        this.updateSize(width, height);
        if (canvasObjects) {
            this.canvasObjects = canvasObjects;
        }
        this.setupEventListeners();
        this.render();
        this.updateDebugValues();
    }
    render() {
        this.renderer.render(this.canvasObjects, this.camera, this.canvas);
    }
    setupEventListeners() {
        this.canvas.addEventListener('contextmenu', e => e.preventDefault());
        this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
        this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
        this.canvas.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
        this.canvas.addEventListener('wheel', this.handleWheel.bind(this));
    }
    handleMouseDown(e) {
        if (e.button === 0) { // Left click
            const selected = this.selectionManager.trySelectAt(this.canvasObjects, this.inputManager.mouseGridPosition);
            if (selected) {
                this.canvas.style.cursor = 'move';
            }
            else {
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
    handleMouseMove(e) {
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
    handleMouseUp() {
        this.canvas.style.cursor = 'default';
        this.selectionManager.stopDragging();
        this.inputManager.stopPanning();
        this.updateDebugValues();
    }
    handleMouseLeave() {
        this.inputManager.stopPanning();
        this.selectionManager.stopDragging();
        this.updateDebugValues();
    }
    handleWheel(e) {
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        this.camera.zoom(e.deltaY, mouseX, mouseY);
        this.render();
        this.updateDebugValues();
    }
    updateSize(width, height) {
        this.size.width = width;
        this.size.height = height;
        this.canvas.width = this.size.width;
        this.canvas.height = this.size.height;
    }
    updateDebugValues() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        const element = document.getElementById('debuggingValues');
        if (!element)
            return;
        const mouseGrid = this.inputManager.mouseGridPosition;
        const mouseScreen = this.inputManager.mouseScreenPosition;
        const selected = this.selectionManager.selected;
        element.innerText =
            `| scale: ${this.camera.scale.toFixed(8)} ` +
                `| panX: ${this.camera.panX.toFixed(8)} ` +
                `| panY: ${this.camera.panY.toFixed(8)} ` +
                `| isPanning: ${this.inputManager.isPanningActive} ` +
                `| mouseGrid: ${(_b = (_a = mouseGrid.x) === null || _a === void 0 ? void 0 : _a.toFixed(8)) !== null && _b !== void 0 ? _b : 'null'}, ${(_d = (_c = mouseGrid.y) === null || _c === void 0 ? void 0 : _c.toFixed(8)) !== null && _d !== void 0 ? _d : 'null'} ` +
                `| mouseScreen: ${(_f = (_e = mouseScreen.x) === null || _e === void 0 ? void 0 : _e.toFixed(8)) !== null && _f !== void 0 ? _f : 'null'}, ${(_h = (_g = mouseScreen.y) === null || _g === void 0 ? void 0 : _g.toFixed(8)) !== null && _h !== void 0 ? _h : 'null'} ` +
                `| selected: '${(_j = selected === null || selected === void 0 ? void 0 : selected.ID) !== null && _j !== void 0 ? _j : 'none'}' |`;
    }
}
