import { IDrawable } from '../../ts/CoreObjects/IDrawable.js';
import { Position } from '../InfiniteCanvas/Position.js';

export class Box implements IDrawable {
    ID: string;
    // properties enforced by the interface
    gridPosition: Position = new Position(null, null);
    screenPosition: Position = new Position(null, null);

    isSelected: boolean = false;

    // properties just in the Box class
    public width: number;
    public height: number;
    public color: string;

    constructor(id : string, width: number, height: number, color: string,
        xPosition: number, yPosition: number, isSelected: boolean = false) {
        this.ID = id;
        this.gridPosition.x = xPosition;
        this.gridPosition.y = yPosition;
        this.width = width;
        this.height = height;
        this.color = color;
        this.isSelected = isSelected;
    }

    draw(context: CanvasRenderingContext2D, offsetX: number, offsetY: number): void {
        // There is currently an error with rounding, so making it 0 for now.
        let rounding = 8;

        console.log(`The grid position of this box is: (${this.gridPosition.x}, ${this.gridPosition.y})`);
        console.log(`The canvas position of this box is: (${this.screenPosition.x}, ${this.screenPosition.y})`);

        let x1 = this.gridPosition.x!;
        let y1 = this.gridPosition.y! ;
        let x2 = this.gridPosition.x! + this.width;
        let y2 = this.gridPosition.y! + this.height;

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

    isMouseOver(gridX: number, gridY: number): boolean {
        return (gridX > this.gridPosition.x! && gridX < this.gridPosition.x! + this.width &&
            gridY > this.gridPosition.y! && gridY < this.gridPosition.y! + this.height);
    }

    drawSelectionOutline(context: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, rounding: number): void {
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

        type Point = [number, number];

        // Corner points
        const corners: Point[] = [
            [x1, y1],
            [x2, y1],
            [x2, y2],
            [x1, y2]
        ];

        // Midpoints
        const midpoints: Point[] = [
            [(x1 + x2) / 2, y1], // Top center
            [x2, (y1 + y2) / 2], // Right center
            [(x1 + x2) / 2, y2], // Bottom center
            [x1, (y1 + y2) / 2]  // Left center
        ];

        // Combine the corners list and midpoints list that was calucated. 
        const markerPoints = [...corners, ...midpoints];

        // Draw all markers as small squares
        markerPoints.forEach(([cx, cy]: Point) => {
            context.beginPath();
            context.arc(cx, cy, 4, 0, Math.PI * 2); // Full circle
            context.fillStyle = "skyblue"; 
            context.fill();
        });

        // Sets the canvas settings back to when context.save() was called.
        context.restore();
    }

    updateScreenPosition(screenPosition: Position): void {
        this.screenPosition.x = screenPosition.x;
        this.screenPosition.y = screenPosition.y;
    }
}