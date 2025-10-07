import { Position } from '../../Shared/Position.js';
import { PositionOnDrawable } from '../PositionOnDrawable.js';
export class Box {
    constructor(id, width, height, color, xPosition, yPosition, isSelected = false) {
        // properties enforced by the interface
        this.gridPosition = new Position(null, null);
        this.screenPosition = new Position(null, null);
        this.padding = 10;
        this.minimumWidth = 30;
        this.minimumHeight = 30;
        this.isSelected = false;
        this.x1 = null;
        this.y1 = null;
        this.x2 = null;
        this.y2 = null;
        this.lastMousePosition = PositionOnDrawable.NotOn;
        this.hoveringMousePosition = PositionOnDrawable.NotOn;
        this.ID = id;
        this.gridPosition.x = xPosition;
        this.gridPosition.y = yPosition;
        this.width = width;
        this.height = height;
        this.color = color;
        this.isSelected = isSelected;
    }
    resize(gridPosition) {
        // Use lastMousePosition to determine HOW to resize
        switch (this.lastMousePosition) {
            case PositionOnDrawable.BottomRightCorner:
                // Your current logic works here
                let proposedWidth = gridPosition.x - this.gridPosition.x;
                let proposedHeight = gridPosition.y - this.gridPosition.y;
                if (proposedWidth > this.minimumWidth) {
                    // Update width and height of the box
                    this.width = proposedWidth;
                }
                if (proposedHeight > this.minimumHeight) {
                    // Update width and height of the box
                    this.height = proposedHeight;
                }
                break;
            case PositionOnDrawable.TopLeftCorner:
                // Calculate how much the corner moved
                const newX = gridPosition.x;
                const newY = gridPosition.y;
                const oldX = this.gridPosition.x;
                const oldY = this.gridPosition.y;
                // Calculate new dimensions
                const proposedWidth2 = (oldX + this.width) - newX;
                const proposedHeight2 = (oldY + this.height) - newY;
                // Only resize if above minimum
                if (proposedWidth2 > this.minimumWidth) {
                    this.gridPosition.x = newX; // Move the anchor point
                    this.width = proposedWidth2;
                }
                if (proposedHeight2 > this.minimumHeight) {
                    this.gridPosition.y = newY; // Move the anchor point
                    this.height = proposedHeight2;
                }
                break;
            // case PositionOnDrawable.RightEdge:
            //     this.resizeRight(gridPosition);
            //     break;
            case PositionOnDrawable.LeftEdge:
                // const newX3 = gridPosition.x!;
                // const oldX3 = this.gridPosition.x!;
                // const proposedWidth3 = (oldX3 + this.width) - newX3;
                // if (proposedWidth3 > this.minimumWidth) {
                //     this.gridPosition.x = newX3;
                //     this.width = proposedWidth3;
                // }
                const newX3 = gridPosition.x;
                const oldX3 = this.gridPosition.x;
                const proposedWidth3 = (oldX3 + this.width) - newX3;
                if (proposedWidth3 >= this.minimumWidth) {
                    this.gridPosition.x = newX3;
                    this.width = proposedWidth3;
                }
                else {
                    // Clamp to minimum
                    this.gridPosition.x = (oldX3 + this.width) - this.minimumWidth;
                    this.width = this.minimumWidth;
                }
                break;
        }
    }
    getMousePosOnDrawable(mousePosition) {
        // Calculate the bounds of the box
        const x1 = this.gridPosition.x;
        const y1 = this.gridPosition.y;
        const x2 = this.gridPosition.x + this.width;
        const y2 = this.gridPosition.y + this.height;
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
    draw(context, offsetX, offsetY) {
        // There is currently an error with rounding, so making it 0 for now.
        let rounding = 8;
        this.x1 = this.gridPosition.x;
        this.y1 = this.gridPosition.y;
        this.x2 = this.gridPosition.x + this.width;
        this.y2 = this.gridPosition.y + this.height;
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
    updateScreenPosition(screenPosition) {
        this.screenPosition.x = screenPosition.x;
        this.screenPosition.y = screenPosition.y;
    }
}
