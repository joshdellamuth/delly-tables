import { Position } from '../InfiniteCanvas/Position.js';
export class Box {
    constructor(width, height, color, xPosition, yPosition, isSelected = false) {
        // properties enforced by the interface
        this.gridPosition = new Position(null, null);
        this.cavnvasPostion = new Position(null, null);
        this.isSelected = false;
        this.gridPosition.x = xPosition;
        this.gridPosition.y = yPosition;
        this.width = width;
        this.height = height;
        this.color = color;
        this.isSelected = isSelected;
    }
    draw(context, offsetX, offsetY) {
        // There is currently an error with rounding, so making it 0 for now.
        let rounding = 15;
        let x1 = this.gridPosition.x + offsetX;
        let y1 = this.gridPosition.y + offsetY;
        let x2 = this.gridPosition.x + offsetX + this.width;
        let y2 = this.gridPosition.y + offsetY + this.height;
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
        if (this.isSelected) {
            this.drawSelectionOutline(context, x1, y1, x2, y2, rounding);
        }
    }
    isMouseOver(x, y) {
        return (x > this.gridPosition.x && x < this.gridPosition.x + this.width &&
            y > this.gridPosition.y && y < this.gridPosition.y + this.height);
    }
    drawSelectionOutline(context, x1, y1, x2, y2, rounding) {
        context.save(); // Save current state
        context.strokeStyle = "skyblue";
        context.lineWidth = 3;
        context.setLineDash([14, 8]); // 14px dash, 8px gap
        context.beginPath();
        context.moveTo(x1 + this.width / 2, y1); // Start at the middle of the top of the box
        context.arcTo(x2, y1, x2, y2, rounding);
        context.arcTo(x2, y2, x1, y2, rounding);
        context.arcTo(x1, y2, x1, y1, rounding);
        context.arcTo(x1, y1, x2, y1, rounding);
        context.closePath();
        context.stroke();
        // Corner points
        const corners = [
            [x1, y1],
            [x2, y1],
            [x2, y2],
            [x1, y2]
        ];
        // Midpoints
        const midpoints = [
            [(x1 + x2) / 2, y1], // Top center
            [x2, (y1 + y2) / 2], // Right center
            [(x1 + x2) / 2, y2], // Bottom center
            [x1, (y1 + y2) / 2] // Left center
        ];
        // Combine the corners list and midpoints list that was calucated. 
        const markerPoints = [...corners, ...midpoints];
        // Draw all markers as small squares
        markerPoints.forEach(([cx, cy]) => {
            context.beginPath();
            context.arc(cx, cy, 4, 0, Math.PI * 2); // Full circle
            context.fillStyle = "skyblue";
            context.fill();
        });
        // Sets the canvas settings back to when context.save() was called.
        context.restore();
    }
}
