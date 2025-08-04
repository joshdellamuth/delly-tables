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

    draw(context: CanvasRenderingContext2D): void {
        console.log("Drawing a box!")

        context.fillStyle = this.color;
        context.fillRect(this.xPosition, this.yPosition, this.width, this.height);
    }

        drawWithOffset(context: CanvasRenderingContext2D, offsetX: number, offsetY: number): void {
        console.log("Drawing a box!")

        context.fillStyle = this.color;
        context.fillRect(this.xPosition + offsetX, this.yPosition + offsetY, this.width, this.height);
    }
}