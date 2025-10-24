import { Position } from '../Shared/Position.ts';

export interface IDrawable {
    ID: string;
    // for an object to be drawable, it should have an x and y position
    gridPosition: Position;
    screenPosition: Position;

    isSelected: boolean;
    lastMousePosition: string;

    draw(context: CanvasRenderingContext2D): void;

    getMousePosOnDrawable(mousePosition: Position): string;

    updateScreenPosition(screenPosition: Position): void;

    resize(gridPosition: Position) : void;
}