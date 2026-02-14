import { DrawableType } from "../DrawableType";
import { ShapeType } from "../ShapeDrawable/ShapeType.ts";
import { BaseDrawable } from "../BaseDrawable";

export class ShapeDrawable implements BaseDrawable {
    id: string;
    type: DrawableType = "shape";
    x: number;
    y: number;
    width: number;
    height: number;
    angle: number;
    color: string;
    strokeWidth: number;
    isDeleted: boolean;
    zIndex: number;
    rounding: number;
    minWidth: number = 10;
    minHeight: number = 10;

    selectionBox: { x: number; y: number; width: number; height: number; };
    boundingBox: { x: number; y: number; width: number; height: number; };

    constructor(id: string, width: number, height: number, xPosition: number, yPosition: number,
        zIndex: number, rounding: number,
        selectionBox: { x: number; y: number; width: number; height: number; },
        boundingBox: { x: number; y: number; width: number; height: number; }) {

        this.id = id;
        this.width = width;
        this.height = height;
        this.x = xPosition;
        this.y = yPosition;
        this.angle = 0;
        this.color = "#0091ca";
        this.strokeWidth = 1;
        this.isDeleted = false;
        this.zIndex = zIndex;
        this.rounding = rounding;
        this.selectionBox = selectionBox;
        this.boundingBox = boundingBox;
    }
}