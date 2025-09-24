import { Position } from '../InfiniteCanvas/Position.js';

export interface IDrawable {
    ID: string;
    // for an object to be drawable, it should have an x and y position
    gridPosition: Position;
    screenPosition: Position;

    isSelected: boolean;
    draw(context: CanvasRenderingContext2D, xOffset: number, yOffset: number): void;

    isMouseOver(x: number, y: number): boolean;

    updateScreenPosition(screenPosition: Position): void;
}