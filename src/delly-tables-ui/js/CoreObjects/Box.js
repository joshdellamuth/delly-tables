export class Box {
    constructor(width, height, color, xPosition, yPosition) {
        this.xPosition = xPosition;
        this.yPosition = yPosition;
        this.width = width;
        this.height = height;
        this.color = color;
    }
    draw(context) {
        console.log("Drawing a box!");
        context.fillStyle = this.color;
        context.fillRect(this.xPosition, this.yPosition, this.width, this.height);
    }
    drawWithOffset(context, offsetX, offsetY) {
        console.log("Drawing a box!");
        context.fillStyle = this.color;
        context.fillRect(this.xPosition + offsetX, this.yPosition + offsetY, this.width, this.height);
    }
}
