export interface IDrawable {
    // for an object to be drawable, it should have an x and y position
    xPosition: number;
    yPosition: number;

    isSelected: boolean;
    draw(context: CanvasRenderingContext2D, xOffset: number, yOffset: number): void;

    isMouseOver(x: number, y: number): boolean;
}