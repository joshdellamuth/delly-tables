import { IDrawable } from '../IDrawable.js';
import { Position } from '../../Shared/Position.js';
import { HoverStatusOptions } from '../HoverStatusOptions.js';


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

    x1: number = null!;
    y1: number = null!;
    x2: number = null!;
    y2: number = null!;

    constructor(id: string, width: number, height: number, color: string,
        xPosition: number, yPosition: number, isSelected: boolean = false) {
        this.ID = id;
        this.gridPosition.x = xPosition;
        this.gridPosition.y = yPosition;
        this.width = width;
        this.height = height;
        this.color = color;
        this.isSelected = isSelected;
    }
    getHoveringState(x: number | null, y: number | null): string {
        const PADDING = 20;

        // Calculate the bounds of the box
        const x1 = this.gridPosition.x!;
        const y1 = this.gridPosition.y!;
        const x2 = this.gridPosition.x! + this.width;
        const y2 = this.gridPosition.y! + this.height;

        // Check if mouse is within the overall box bounds (with padding)
        if (x === null || y === null) {
            return HoverStatusOptions.NotHovering;
        }

        if (x < x1 - PADDING || x > x2 + PADDING ||
            y < y1 - PADDING || y > y2 + PADDING) {
            return HoverStatusOptions.NotHovering;
        }

        // Define helper functions for edge detection
        const isNearLeft = x >= x1 - PADDING && x <= x1 + PADDING;
        const isNearRight = x >= x2 - PADDING && x <= x2 + PADDING;
        const isNearTop = y >= y1 - PADDING && y <= y1 + PADDING;
        const isNearBottom = y >= y2 - PADDING && y <= y2 + PADDING;

        // Check corners first (corners have priority over edges)
        if (isNearLeft && isNearTop) {
            return HoverStatusOptions.TopLeftCorner;
        }
        if (isNearRight && isNearTop) {
            return HoverStatusOptions.TopRightCorner;
        }
        if (isNearLeft && isNearBottom) {
            return HoverStatusOptions.BottomLeftCorner;
        }
        if (isNearRight && isNearBottom) {
            return HoverStatusOptions.BottomRightCorner;
        }

        // Check edges
        if (isNearLeft) {
            return HoverStatusOptions.LeftEdge;
        }
        if (isNearRight) {
            return HoverStatusOptions.RightEdge;
        }
        if (isNearTop) {
            return HoverStatusOptions.TopEdge;
        }
        if (isNearBottom) {
            return HoverStatusOptions.BottomEdge;
        }

        // Mouse is inside the box but not near any edge
        return HoverStatusOptions.Inside;
    }

    draw(context: CanvasRenderingContext2D, offsetX: number, offsetY: number): void {
        // There is currently an error with rounding, so making it 0 for now.
        let rounding = 8;

        this.x1 = this.gridPosition.x!;
        this.y1 = this.gridPosition.y!;
        this.x2 = this.gridPosition.x! + this.width;
        this.y2 = this.gridPosition.y! + this.height;

        context.fillStyle = this.color;
        context.beginPath();
        // go to the starting point
        context.moveTo(this.x1, this.y1);
        context.arcTo(this.x2, this.y1, this.x2, this.y2, rounding);
        context.arcTo(this.x2, this.y2, this.x1, this.y2, rounding);
        context.arcTo(this.x1, this.y2, this.x1, this.y1, rounding);
        context.arcTo(this.x1, this.y1, this.x2, this.y1, rounding);
        context.closePath();
        context.fill();

        if (this.isSelected) {
            this.drawSelectionOutline(context, this.x1, this.y1, this.x2, this.y2, rounding);
        }
    }

    isMouseOver(gridX: number, gridY: number): boolean {
        // Return whether the mouse is over the box
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