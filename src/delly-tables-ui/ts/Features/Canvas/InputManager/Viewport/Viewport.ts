import { Position } from '../../Shared/Position.ts';

export class Viewport {
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

    screenToGrid(screenPosition: Position): Position {
        return new Position(
            (screenPosition.x! - this._panX) / this._scale,
            (screenPosition.y! - this._panY) / this._scale
        );
    }

    convertToScreenPos(gridPosition : Position, canvas: HTMLCanvasElement,
        xDistanceFromOrigin: number, yDistanceFromOrigin: number,
        scale: number): Position {
        const rect = canvas.getBoundingClientRect();
        const canvasX = gridPosition.x! - rect.left;
        const canvasY = gridPosition.y! - rect.top;

        // Transform canvas coordinates given to world coordinates
        const xScreenPosition = (canvasX - xDistanceFromOrigin) / scale;
        const yScreenPosition = (canvasY - yDistanceFromOrigin) / scale;

        return new Position(xScreenPosition, yScreenPosition);
    }
}