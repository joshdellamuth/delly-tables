export interface IDrawable {

    // for an object to be drawable, it should have an x and y position
    xPosition: number;
    yPosition: number;

    draw(context: CanvasRenderingContext2D): void;

    drawWithOffset(context: CanvasRenderingContext2D, xOffset: number, yOffset: number): void;
}