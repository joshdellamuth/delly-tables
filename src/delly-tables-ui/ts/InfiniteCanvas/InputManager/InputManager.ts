import { Position } from '../Shared/Position.js';
import { Viewport } from '../Viewport/Viewport.js';


export class InputManager {
    private mouseScreenPos: Position = new Position(null, null);
    private mouseGridPos: Position = new Position(null, null);
    private isPanning: boolean = false;
    private panStart: Position = new Position(null, null);

    get mouseScreenPosition(): Position { return this.mouseScreenPos; }
    get mouseGridPosition(): Position { return new Position(this.mouseGridPos.x, this.mouseGridPos.y); }
    get isPanningActive(): boolean { return this.isPanning; }

    updateMousePosition(canvas: HTMLCanvasElement, clientX: number, clientY: number, viewport: Viewport): void {
        console.log(viewport);
        
        const rect = canvas.getBoundingClientRect();
        this.mouseScreenPos.x = clientX - rect.left;
        this.mouseScreenPos.y = clientY - rect.top;

        console.log(this.mouseScreenPos);

        const gridPos: Position = viewport.screenToGrid(
            new Position(this.mouseScreenPos.x, this.mouseScreenPos.y));

        this.mouseGridPos.x = gridPos.x;
        this.mouseGridPos.y = gridPos.y;
    }

    startPanning(clientX: number, clientY: number): void {
        this.isPanning = true;
        this.panStart.x = clientX;
        this.panStart.y = clientY;
    }

    updatePanning(clientX: number, clientY: number): { deltaX: number, deltaY: number } {
        if (!this.isPanning || this.panStart.x === null || this.panStart.y === null) {
            return { deltaX: 0, deltaY: 0 };
        }

        const deltaX = clientX - this.panStart.x;
        const deltaY = clientY - this.panStart.y;

        this.panStart.x = clientX;
        this.panStart.y = clientY;

        return { deltaX, deltaY };
    }

    stopPanning(): void {
        this.isPanning = false;
        this.panStart.x = null;
        this.panStart.y = null;
    }
}