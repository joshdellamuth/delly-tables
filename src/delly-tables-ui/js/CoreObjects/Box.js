export class Box {
    constructor(width, height, color, xPosition, yPosition) {
        this.xPosition = xPosition;
        this.yPosition = yPosition;
        this.width = width;
        this.height = height;
        this.color = color;
    }
    draw(context, offsetX, offsetY) {
        console.log("Drawing a box!");
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
