import { Position } from '../Shared/Position';
import { ICanvObject } from "../Base/CanvObject/ICanvObject";
import { CanvasPosition } from '../Shared/CanvasPosition';

export interface IDrawable extends ICanvObject {
    // Properties
    ID: string;
    gridPosition: Position;
    screenPosition: Position;
    width: number;
    height: number;
    minimumWidth: number;
    minimumHeight: number;
    isSelected: boolean;

    lastMousePosition: number;

    padding: number;
    rounding: number;

    // Methods
    draw(context: CanvasRenderingContext2D, zoom: number): void;
    getMousePosOnDrawable(mousePosition: Position): number;
    updateScreenPosition(screenPosition: Position): void;
    resize(gridPosition: Position, mousePosition: number): void;
}