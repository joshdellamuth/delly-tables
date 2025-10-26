import { Position } from '../../../Shared/Position';
import { ICanvObject } from "../CanvObject/ICanvObject";

export interface IDrawable extends ICanvObject {
    // Properties
    gridPosition: Position;
    screenPosition: Position;
    width: number;
    height: number;
    minimumWidth: number;
    minimumHeight: number;
    isSelected: boolean;

    lastMousePosition: string;

    padding: number;
    rounding: number;

    // Methods
    draw(context: CanvasRenderingContext2D): void;
    getMousePosOnDrawable(mousePosition: Position): string;
    updateScreenPosition(screenPosition: Position): void;
    resize(gridPosition: Position) : void;
}