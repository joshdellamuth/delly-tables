import { Position } from '../../../Shared/Position';
import { ICanvObject } from "../CanvObject/ICanvObject";

export interface IDrawable extends ICanvObject {
    gridPosition: Position;
    screenPosition: Position;
    padding: number;
    minimumWidth: number;
    minimumHeight: number;
    isSelected: boolean;
}