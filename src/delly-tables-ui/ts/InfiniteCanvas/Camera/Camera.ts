import { Position } from '../Shared/Position.js';

export class Camera {
    private _scale: number = 1;
    private _panX: number = 0;
    private _panY: number = 0;

    get scale(): number { return this._scale; }
    get panX(): number { return this._panX; }
    get panY(): number { return this._panY; }

    zoom(delta: number, mouseX: number, mouseY: number): void {
        const zoomFactor = 1.18;
        const scaleFactor = delta < 0 ? zoomFactor : 1 / zoomFactor;
        const newScale = this._scale * scaleFactor;

        this._panX = mouseX - (mouseX - this._panX) * (newScale / this._scale);
        this._panY = mouseY - (mouseY - this._panY) * (newScale / this._scale);
        this._scale = newScale;
    }

    pan(deltaX: number, deltaY: number): void {
        this._panX += deltaX;
        this._panY += deltaY;
    }

    screenToGrid(screenX: number, screenY: number): Position {
        return new Position(
            (screenX - this._panX) / this._scale,
            (screenY - this._panY) / this._scale
        );
    }
}