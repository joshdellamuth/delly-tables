import { Position } from '../Shared/Position';
import { ICanvObject } from "../Base/CanvObject/ICanvObject";

export interface IDrawable
    extends ICanvObject {
    // Properties
    gridPosition: Position;
    screenPosition: Position;

    width: number;
    height: number;

    minimumWidth: number;
    minimumHeight: number;

    lastMousePosition: number;
    originalDimensions: { x: number; y: number; width: number; height: number } | null;

    points: Position[];

    padding: number;
    rounding: number;

    // Methods
    draw(context: CanvasRenderingContext2D, zoom: number): void;
    getMousePosOnDrawable(mousePosition: Position): number;
    updateScreenPosition(screenPosition: Position): void;
    resize(gridPosition: Position, mousePosition: number,
        isMassResize: boolean, delta: Position | null,
        originalDimensions: { x: number; y: number; width: number; height: number; } | null): void;
}