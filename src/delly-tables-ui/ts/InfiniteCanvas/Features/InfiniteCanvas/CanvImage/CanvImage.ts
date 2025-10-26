import { IDrawable } from '../../Base/Drawable/IDrawable.ts';
import { Position } from '../../../Shared/Position.ts';
import { PositionOnDrawable } from '../../../Shared/PositionOnDrawable.ts';
import { RectangularDrawable } from '../../Base/Drawable/RectangularDrawable/RectangularDrawable.ts';

export class CanvImage extends RectangularDrawable implements IDrawable {
    // properties enforced by the interface
    gridPosition: Position = new Position(null, null);
    screenPosition: Position = new Position(null, null);
    padding: number = 20;
    minimumWidth: number = 30;
    minimumHeight: number = 30;
    isSelected: boolean = false;
    rounding: number = 0;

    src: string;

    x1: number = null!;
    y1: number = null!;
    x2: number = null!;
    y2: number = null!;

    lastMousePosition: string = PositionOnDrawable.NotOn;

    constructor(id: string, src: string, width: number, height: number,
        xPosition: number, yPosition: number, isSelected: boolean = false) {

        super(id, width, height, xPosition, yPosition, isSelected);

        this.src = src;
    }

    override draw(context: CanvasRenderingContext2D): void {
        if (this.gridPosition.x === null || this.gridPosition.y === null) return;

        var image = new Image();
        image.src = this.src;

        context.drawImage(image, this.gridPosition.x, this.gridPosition.y, this.width, this.height);

        if (this.isSelected) {
            this.x1 = this.gridPosition.x;
            this.y1 = this.gridPosition.y;
            this.x2 = this.gridPosition.x + this.width;
            this.y2 = this.gridPosition.y + this.height;

            this.drawSelectionOutline(context, this.x1, this.y1, this.x2, this.y2);
        }
    }

    getMousePosOnDrawable(mousePosition: Position): string {
        // Calculate the bounds of the box
        const x1 = this.gridPosition.x!;
        const y1 = this.gridPosition.y!;
        const x2 = this.gridPosition.x! + this.width;
        const y2 = this.gridPosition.y! + this.height;

        // Check if mouse is within the overall box bounds (with padding)
        if (mousePosition.x === null || mousePosition.y === null) {
            this.lastMousePosition = PositionOnDrawable.NotOn;
            return PositionOnDrawable.NotOn;
        }

        if (mousePosition.x < x1 - this.padding || mousePosition.x > x2 + this.padding ||
            mousePosition.y < y1 - this.padding || mousePosition.y > y2 + this.padding) {
            this.lastMousePosition = PositionOnDrawable.NotOn;
            return PositionOnDrawable.NotOn;
        }

        // Define helper functions for edge detection
        const isNearLeft = mousePosition.x >= x1 - this.padding && mousePosition.x <= x1 + this.padding;
        const isNearRight = mousePosition.x >= x2 - this.padding && mousePosition.x <= x2 + this.padding;
        const isNearTop = mousePosition.y >= y1 - this.padding && mousePosition.y <= y1 + this.padding;
        const isNearBottom = mousePosition.y >= y2 - this.padding && mousePosition.y <= y2 + this.padding;

        // Check corners first (corners have priority over edges)
        if (isNearLeft && isNearTop) {
            this.lastMousePosition = PositionOnDrawable.TopLeftCorner;
            return PositionOnDrawable.TopLeftCorner;
        }
        if (isNearRight && isNearTop) {
            this.lastMousePosition = PositionOnDrawable.TopRightCorner;
            return PositionOnDrawable.TopRightCorner;
        }
        if (isNearLeft && isNearBottom) {
            this.lastMousePosition = PositionOnDrawable.BottomLeftCorner;
            return PositionOnDrawable.BottomLeftCorner;
        }
        if (isNearRight && isNearBottom) {
            this.lastMousePosition = PositionOnDrawable.BottomRightCorner;
            return PositionOnDrawable.BottomRightCorner;
        }

        // Check edges
        if (isNearLeft) {
            this.lastMousePosition = PositionOnDrawable.LeftEdge;
            return PositionOnDrawable.LeftEdge;
        }
        if (isNearRight) {
            this.lastMousePosition = PositionOnDrawable.RightEdge;
            return PositionOnDrawable.RightEdge;
        }
        if (isNearTop) {
            this.lastMousePosition = PositionOnDrawable.TopEdge;
            return PositionOnDrawable.TopEdge;
        }
        if (isNearBottom) {
            this.lastMousePosition = PositionOnDrawable.BottomEdge;
            return PositionOnDrawable.BottomEdge;
        }

        // Mouse is inside the box but not near any edge
        this.lastMousePosition = PositionOnDrawable.Inside;
        return PositionOnDrawable.Inside;
    }

    drawSelectionOutline(
        context: CanvasRenderingContext2D,
        x1: number,
        y1: number,
        x2: number,
        y2: number,
    ): void {
        context.save();
        context.strokeStyle = "skyblue";
        context.lineWidth = 3;
        context.setLineDash([14, 8]);

        context.beginPath();
        context.moveTo(x1, y1);       // Top-left
        context.lineTo(x2, y1);       // Top-right
        context.lineTo(x2, y2);       // Bottom-right
        context.lineTo(x1, y2);       // Bottom-left
        context.closePath();          // Back to top-left
        context.stroke();

        type Point = [number, number];

        const corners: Point[] = [
            [x1, y1],
            [x2, y1],
            [x2, y2],
            [x1, y2]
        ];

        const midpoints: Point[] = [
            [(x1 + x2) / 2, y1],
            [x2, (y1 + y2) / 2],
            [(x1 + x2) / 2, y2],
            [x1, (y1 + y2) / 2]
        ];

        const markerPoints = [...corners, ...midpoints];

        markerPoints.forEach(([cx, cy]: Point) => {
            context.beginPath();
            context.arc(cx, cy, 4, 0, Math.PI * 2);
            context.fillStyle = "skyblue";
            context.fill();
        });

        context.restore();
    }
}