import { Position } from './Position.js';

export class Utilities {

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