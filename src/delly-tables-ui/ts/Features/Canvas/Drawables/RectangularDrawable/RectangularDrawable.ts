import { Position } from "../../Shared/Position";
import { IDrawable } from "../IDrawable";
import { CanvasPosition } from "../../Shared/CanvasPosition";
import { RectangularDrawableResizing } from "./RectangularDrawableResizing";

export abstract class RectangularDrawable implements IDrawable {
    ID: string = "";
    gridPosition: Position = new Position(null, null);
    screenPosition: Position = new Position(null, null);
    width: number;
    height: number;
    minimumWidth: number = 30;
    minimumHeight: number = 30;
    isSelected: boolean;
    padding: number = 20;
    rounding: number = 0;

    lastMousePosition: number = CanvasPosition.NotOn;

    constructor(id: string, width: number, height: number,
        xPosition: number, yPosition: number, isSelected: boolean = false) {
        this.ID = id;
        this.gridPosition.x = xPosition;
        this.gridPosition.y = yPosition;
        this.width = width;
        this.height = height;
        this.isSelected = isSelected;
    }

    // Overrid-able method for rectangluar drawables 
    draw(context: CanvasRenderingContext2D, zoom: number): void {
        throw new Error("Method not implemented.");
    }

    getMousePosOnDrawable(mousePosition: Position): number {
        // Calculate the bounds of the box
        const x1 = this.gridPosition.x!;
        const y1 = this.gridPosition.y!;
        const x2 = this.gridPosition.x! + this.width;
        const y2 = this.gridPosition.y! + this.height;

        // Check if mouse is within the overall box bounds (with padding)
        if (mousePosition.x === null || mousePosition.y === null) {
            this.lastMousePosition = CanvasPosition.NotOn;
            return CanvasPosition.NotOn;
        }

        if (mousePosition.x < x1 - this.padding || mousePosition.x > x2 + this.padding ||
            mousePosition.y < y1 - this.padding || mousePosition.y > y2 + this.padding) {
            this.lastMousePosition = CanvasPosition.NotOn;
            return CanvasPosition.NotOn;
        }

        // Define helper functions for edge detection
        const isNearLeft = mousePosition.x >= x1 - this.padding && mousePosition.x <= x1 + this.padding;
        const isNearRight = mousePosition.x >= x2 - this.padding && mousePosition.x <= x2 + this.padding;
        const isNearTop = mousePosition.y >= y1 - this.padding && mousePosition.y <= y1 + this.padding;
        const isNearBottom = mousePosition.y >= y2 - this.padding && mousePosition.y <= y2 + this.padding;

        // Check corners first (corners have priority over edges)
        if (isNearLeft && isNearTop) {
            this.lastMousePosition = CanvasPosition.TopLeftCorner;
            return CanvasPosition.TopLeftCorner;
        }
        if (isNearRight && isNearTop) {
            this.lastMousePosition = CanvasPosition.TopRightCorner;
            return CanvasPosition.TopRightCorner;
        }
        if (isNearLeft && isNearBottom) {
            this.lastMousePosition = CanvasPosition.BottomLeftCorner;
            return CanvasPosition.BottomLeftCorner;
        }
        if (isNearRight && isNearBottom) {
            this.lastMousePosition = CanvasPosition.BottomRightCorner;
            return CanvasPosition.BottomRightCorner;
        }

        // Check edges
        if (isNearLeft) {
            this.lastMousePosition = CanvasPosition.LeftEdge;
            return CanvasPosition.LeftEdge;
        }
        if (isNearRight) {
            this.lastMousePosition = CanvasPosition.RightEdge;
            return CanvasPosition.RightEdge;
        }
        if (isNearTop) {
            this.lastMousePosition = CanvasPosition.TopEdge;
            return CanvasPosition.TopEdge;
        }
        if (isNearBottom) {
            this.lastMousePosition = CanvasPosition.BottomEdge;
            return CanvasPosition.BottomEdge;
        }

        // Mouse is inside the box but not near any edge
        this.lastMousePosition = CanvasPosition.Inside;
        return CanvasPosition.Inside;
    }

    updateScreenPosition(screenPosition: Position): void {
        this.screenPosition.x = screenPosition.x;
        this.screenPosition.y = screenPosition.y;
    }

    resize(gridPosition: Position, mousePosition: number): void {
        switch (mousePosition) {
            case CanvasPosition.BottomRightCorner:
                RectangularDrawableResizing.resizeFromBottomRightCorner(this, gridPosition);
                break;

            case CanvasPosition.TopLeftCorner:
                RectangularDrawableResizing.resizeFromTopLeftCorner(this, gridPosition);
                break;

            case CanvasPosition.TopRightCorner:
                RectangularDrawableResizing.resizeFromTopRightCorner(this, gridPosition);
                break;

            case CanvasPosition.BottomLeftCorner:
                RectangularDrawableResizing.resizeFromBottomLeftCorner(this, gridPosition);
                break;

            // Edges
            case CanvasPosition.RightEdge:
                RectangularDrawableResizing.resizeFromRightEdge(this, gridPosition);
                break;

            case CanvasPosition.LeftEdge:
                RectangularDrawableResizing.resizeFromLeftEdge(this, gridPosition);
                break;

            case CanvasPosition.TopEdge:
                RectangularDrawableResizing.resizeFromTopEdge(this, gridPosition);
                break;

            case CanvasPosition.BottomEdge:
                RectangularDrawableResizing.resizeFromBottomEdge(this, gridPosition);
                break;
        }
    }

    drawSelectionOutline(context: CanvasRenderingContext2D, x1: number,
        y1: number, x2: number, y2: number,
        rounding: number, scale: number): void {

        context.save(); // Save current state
        context.strokeStyle = "skyblue";

        context.lineWidth = 3;


        context.setLineDash([20, 16]); // 14px dash, 8px gap

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
}