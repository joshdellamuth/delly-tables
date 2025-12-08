import { Position } from "../Shared/Position";
import { IDrawable } from "./IDrawable";
import { CanvasPosition } from "../Shared/CanvasPosition";
import { IRectangularDrawable, RectangularDrawable } from "./RectangularDrawable/RectangularDrawable";
import { v4 as uuidv4 } from 'uuid';

export interface ITextDrawable
    extends IRectangularDrawable {
    size: string;
}

export class TextDrawable
    extends RectangularDrawable
    implements ITextDrawable {
    size: string;
    gridPosition: Position = new Position(null, null);
    screenPosition: Position = new Position(null, null);
    width: number;
    height: number;
    minimumWidth: number = 30;
    minimumHeight: number = 30;
    padding: number = 20;
    rounding: number = 0;
    points: Position[] = [];

    // Initialize text to nothing
    text: string = '';

    originalDimensions: { x: number; y: number; width: number; height: number; } | null;
    lastMousePosition: number = CanvasPosition.NotOn;

    constructor(size: string, xPosition: number,

        yPosition: number,
        width: number,
        height: number) {

        let id = uuidv4();
        super(id, width, height, xPosition, yPosition);

        this.size = size;
        this.gridPosition.x = xPosition;
        this.gridPosition.y = yPosition;
        this.width = width;
        this.height = height;
        this.originalDimensions = null;

        this.updatePoints();
    }

    public draw(context: CanvasRenderingContext2D, scale: number): void {
        this.updatePoints();

        context.font = this.size;
        context.fillStyle = 'black';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(this.text, this.gridPosition.x!, this.gridPosition.y!);
    }

    public addText(text: string): void {
        this.text = this.text + text;

        const letters = this.text.split("");

        let widthToAdd = 5;

        let widthToAddEachSize = widthToAdd / 2;

        this.gridPosition.x = this.gridPosition.x! - widthToAddEachSize;

        letters.forEach(letter => {
            this.width = this.width + widthToAddEachSize;
        });
    }

    removeText(): void {
        this.text = this.text.substring(0, this.text.length - 1);

        const letters = this.text.split("");

        let widthToSubtract = 5;

        let widthToSubtractEachSize = widthToSubtract / 2;

        this.gridPosition.x = this.gridPosition.x! + widthToSubtractEachSize;

        letters.forEach(letter => {
            this.width = this.width - widthToSubtractEachSize;
        });
    }

    public updateText(text: string, indexToUpdate: number | null): void {
        if (indexToUpdate === null)
            indexToUpdate = this.text.length - 1;

        this.text = text;
    }
}