import { Position } from "../Shared/Position";
import { IDrawable } from "./IDrawable";
import { CanvasPosition } from "../Shared/CanvasPosition";
import { IRectangularDrawable, RectangularDrawable } from "./RectangularDrawable/RectangularDrawable";
import { v4 as uuidv4 } from 'uuid';

export interface ITextDrawable
    extends IRectangularDrawable {
    size: string;
    ctx: CanvasRenderingContext2D;

    gridPosition: Position;
    screenPosition: Position;
    width: number;
    height: number;
    minimumWidth: number;
    minimumHeight: number;
    padding: number;
    rounding: number;
    points: Position[];
}

export class TextDrawable
    extends RectangularDrawable
    implements ITextDrawable {
    ctx: CanvasRenderingContext2D;
    size: string;
    gridPosition: Position = new Position(null, null);
    screenPosition: Position = new Position(null, null);
    width: number;
    height: number;
    minimumWidth: number = 10;
    minimumHeight: number = 10;
    padding: number = 20;
    rounding: number = 0;
    points: Position[] = [];

    // Initialize text to nothing
    text: string = '';

    originalDimensions: { x: number; y: number; width: number; height: number; } | null;
    lastMousePosition: number = CanvasPosition.NotOn;

    constructor(ctx: CanvasRenderingContext2D, size: string, xPosition: number,
        yPosition: number,
        width: number,
        height: number) {

        let id = uuidv4();
        super(id, width, height, xPosition, yPosition);

        this.ctx = ctx;
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
        context.textAlign = 'left';
        context.textBaseline = 'top';
        context.fillText(this.text, this.gridPosition.x!, this.gridPosition.y!);
    }

    public addCharacter(char: string): void {
        this.text = this.text + char;

        const metrics = this.ctx.measureText(char);
        let characterWidth = metrics.width;

        this.width = this.width + characterWidth;
    }

    public removeText(): void {

        this.text = this.text.substring(0, this.text.length - 1);

        let character = this.getCharAtCursor();

        if (!character) {
            return;
        }

        const metrics = this.ctx.measureText(character);
        const characterWidth = metrics.width;

        this.width = this.width - characterWidth;
    }

    public updateText(text: string, indexToUpdate: number | null): void {
        if (indexToUpdate === null)
            indexToUpdate = this.text.length - 1;

        this.text = text;
    }

    public getCharAtCursor(): string | null {
        // TODO: Actaully get the character at the position of the cursor instead of the last character.

        const last = this.text.at(-1);

        if (last) {
            return last;
        }

        return null;
    }

    public getCharWidthAtCursor(): number | null {

        const character = this.getCharAtCursor();

        if (!character) {
            return null;
        }

        const metrics = this.ctx.measureText(character);
        return metrics.width;
    }
}