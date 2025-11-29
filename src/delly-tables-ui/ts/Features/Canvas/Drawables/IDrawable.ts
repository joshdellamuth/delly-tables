import { Position } from '../Shared/Position';
import { ICanvObject } from "../Base/CanvObject/ICanvObject";

export interface IDrawable extends ICanvObject {
    // Properties
    ID: string;
    gridPosition: Position;
    screenPosition: Position;
    width: number;
    height: number;
    minimumWidth: number;
    minimumHeight: number;

    points: Position[];

    lastMousePosition: number;

    padding: number;
    rounding: number;

    // Methods
    draw(context: CanvasRenderingContext2D, zoom: number, rounding: number | null): void;
    getMousePosOnDrawable(mousePosition: Position): number;
    updateScreenPosition(screenPosition: Position): void;
    resize(gridPosition: Position, mousePosition: number): void;
}