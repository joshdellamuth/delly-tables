import { IDrawable } from '../IDrawable.ts';
import { RectangularDrawable } from '../RectangularDrawable/RectangularDrawable.ts';

export class Box
    extends RectangularDrawable
    implements IDrawable {

    // properties just in the Box class
    public color: string;

    rounding = 8;

    constructor(id: string, width: number, height: number, color: string,
        xPosition: number, yPosition: number) {
        super(id, width, height, xPosition, yPosition);

        this.color = color;
    }

    public draw(context: CanvasRenderingContext2D, scale: number): void {
        this.updatePoints();

        // There is currently an error with rounding, so making it 0 for now.
        let rounding = this.rounding;

        context.fillStyle = this.color;
        context.beginPath();
        // go to the starting point
        // x1, x1
        context.moveTo(this.points[0].x!, this.points[0].y!);

        // x2, y1 to x2, y2
        context.arcTo(this.points[1].x!, this.points[1].y!, this.points[2].x!, this.points[2].y!, rounding);
        // x2, y1 to x2, y2
        context.arcTo(this.points[2].x!, this.points[2].y!, this.points[3].x!, this.points[3].y!, rounding);
        context.arcTo(this.points[3].x!, this.points[3].y!, this.points[0].x!, this.points[0].y!, rounding);
        context.arcTo(this.points[0].x!, this.points[0].y!, this.points[1].x!, this.points[1].y!, rounding);
        context.closePath();
        context.fill();

    }
}