import { IDrawable } from '../IDrawable.ts';
import { RectangularDrawable } from '../RectangularDrawable/RectangularDrawable.ts';
import { Position } from '../../Shared/Position.ts';

export class MassSelectionBox
    extends RectangularDrawable
    implements IDrawable {

    // properties just in the Box class
    public color: string;

    x1: number = null!;
    y1: number = null!;
    x2: number = null!;
    y2: number = null!;

    points: Position[] = [];

    rounding: number = 8;

    constructor(id: string, width: number, height: number, color: string,
        xPosition: number, yPosition: number) {
        super(id, width, height, xPosition, yPosition);

        this.color = color;
    }

    override draw(context: CanvasRenderingContext2D, scale: number): void {
        // There is currently an error with rounding, so making it 0 for now.

        this.x1 = this.gridPosition.x!;
        this.y1 = this.gridPosition.y!;
        this.x2 = this.gridPosition.x! + this.width;
        this.y2 = this.gridPosition.y! + this.height;

        context.fillStyle = this.color;
        context.beginPath();
        // go to the starting point
        context.moveTo(this.x1, this.y1);

        let rounding = this.rounding;

        context.arcTo(this.x2, this.y1, this.x2, this.y2, rounding);
        context.arcTo(this.x2, this.y2, this.x1, this.y2, rounding);
        context.arcTo(this.x1, this.y2, this.x1, this.y1, rounding);
        context.arcTo(this.x1, this.y1, this.x2, this.y1, rounding);
        context.closePath();
        context.fill();


        super.drawSelectionOutline(context, this.x1, this.y1, this.x2, this.y2, rounding, scale);
    }
}