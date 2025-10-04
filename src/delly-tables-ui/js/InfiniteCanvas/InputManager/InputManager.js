import { Position } from '../Shared/Position.js';
export class InputManager {
    constructor() {
        this.mouseScreenPos = new Position(null, null);
        this.mouseGridPos = new Position(null, null);
        this.isPanning = false;
        this.panStart = new Position(null, null);
    }
    get mouseScreenPosition() { return this.mouseScreenPos; }
    get mouseGridPosition() { return new Position(this.mouseGridPos.x, this.mouseGridPos.y); }
    get isPanningActive() { return this.isPanning; }
    updateMousePosition(canvas, clientX, clientY, viewport) {
        console.log(viewport);
        const rect = canvas.getBoundingClientRect();
        this.mouseScreenPos.x = clientX - rect.left;
        this.mouseScreenPos.y = clientY - rect.top;
        console.log(this.mouseScreenPos);
        const gridPos = viewport.screenToGrid(new Position(this.mouseScreenPos.x, this.mouseScreenPos.y));
        this.mouseGridPos.x = gridPos.x;
        this.mouseGridPos.y = gridPos.y;
    }
    startPanning(clientX, clientY) {
        this.isPanning = true;
        this.panStart.x = clientX;
        this.panStart.y = clientY;
    }
    updatePanning(clientX, clientY) {
        if (!this.isPanning || this.panStart.x === null || this.panStart.y === null) {
            return { deltaX: 0, deltaY: 0 };
        }
        const deltaX = clientX - this.panStart.x;
        const deltaY = clientY - this.panStart.y;
        this.panStart.x = clientX;
        this.panStart.y = clientY;
        return { deltaX, deltaY };
    }
    stopPanning() {
        this.isPanning = false;
        this.panStart.x = null;
        this.panStart.y = null;
    }
}
