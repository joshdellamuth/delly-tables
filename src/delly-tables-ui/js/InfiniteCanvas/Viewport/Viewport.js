import { Position } from '../Shared/Position.js';
export class Viewport {
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
    screenToGrid(screenPosition) {
        return new Position((screenPosition.x - this._panX) / this._scale, (screenPosition.y - this._panY) / this._scale);
    }
    convertToScreenPos(gridPosition, canvas, xDistanceFromOrigin, yDistanceFromOrigin, scale) {
        const rect = canvas.getBoundingClientRect();
        const canvasX = gridPosition.x - rect.left;
        const canvasY = gridPosition.y - rect.top;
        // Transform canvas coordinates given to world coordinates
        const xScreenPosition = (canvasX - xDistanceFromOrigin) / scale;
        const yScreenPosition = (canvasY - yDistanceFromOrigin) / scale;
        return new Position(xScreenPosition, yScreenPosition);
    }
}
