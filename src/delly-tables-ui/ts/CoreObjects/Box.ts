import { IDrawable } from '../../ts/CoreObjects/IDrawable.js';

export class Box implements IDrawable {
    // properties enforced by the interface
    xPosition: number;
    yPosition: number;

    // properties just in the Box class
    public width: number;
    public height: number;
    public color: string;


    constructor(width: number, height: number, color: string,
        xPosition: number, yPosition: number) {
        this.xPosition = xPosition;
        this.yPosition = yPosition;
        this.width = width;
        this.height = height;
        this.color = color;
    }

    draw(context: CanvasRenderingContext2D, offsetX: number, offsetY: number): void {
        console.log("Drawing a box!")

        // There is currently an error with rounding, so making it 0 for now.
        let rounding = 15;

        let x1 = this.xPosition + offsetX;
        let y1 = this.yPosition + offsetY;
        let x2 = this.xPosition + offsetX + this.width;
        let y2 = this.yPosition + offsetY + this.height;

        context.fillStyle = this.color;
        context.beginPath();
        // go to the starting point
        context.moveTo(x1, y1);
        context.arcTo(x2, y1, x2, y2, rounding);
        context.arcTo(x2, y2, x1, y2, rounding);
        context.arcTo(x1, y2, x1, y1, rounding);
        context.arcTo(x1, y1, x2, y1, rounding);
        context.closePath();
        context.fill();
    }
}