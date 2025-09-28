import { Position } from '../Shared/Position.js';
export class Camera {
    constructor() {
        this._scale = 1;
        this._panX = 0;
        this._panY = 0;
    }
    get scale() { return this._scale; }
    get panX() { return this._panX; }
    get panY() { return this._panY; }
    zoom(delta, mouseX, mouseY) {
        const zoomFactor = 1.18;
        const scaleFactor = delta < 0 ? zoomFactor : 1 / zoomFactor;
        const newScale = this._scale * scaleFactor;
        this._panX = mouseX - (mouseX - this._panX) * (newScale / this._scale);
        this._panY = mouseY - (mouseY - this._panY) * (newScale / this._scale);
        this._scale = newScale;
    }
    pan(deltaX, deltaY) {
        this._panX += deltaX;
        this._panY += deltaY;
    }
    screenToGrid(screenX, screenY) {
        return new Position((screenX - this._panX) / this._scale, (screenY - this._panY) / this._scale);
    }
}
