// import { ShapeDrawable } from "../ShapeDrawable/ShapeDrawable";
// import { CanvasPosition } from "../../Shared/CanvasPosition";

// export class RectDrawable extends ShapeDrawable {
//     shapeType = "rect";


//     public draw(context: CanvasRenderingContext2D): void {
//         // There is currently an error with rounding, so making it 0 for now.
//         let rounding = this.rounding;

//         context.fillStyle = this.color;
//         context.beginPath();
//         // go to the starting point
//         // x1, x1
//         context.moveTo(this.x, this.y);

//         let xWithWidth = this.x + this.width;
//         let yWithHeight = this.y + this.height;

//         // x2, y1 to x2, y2
//         context.arcTo(xWithWidth, this.y, xWithWidth, yWithHeight, rounding);
//         // x2, y1 to x2, y2
//         context.arcTo(xWithWidth, yWithHeight, this.x, yWithHeight, rounding);
//         context.arcTo(this.x, yWithHeight, this.x, this.y, rounding);
//         context.arcTo(this.x, this.y, xWithWidth, this.y, rounding);
//         context.closePath();
//         context.fill();
//     }

//     getMousePosOnDrawable(mouseX: number, mouseY: number): number {
//         // Calculate the bounds of the box
//         const x1 = this.x;
//         const y1 = this.y;
//         const x2 = this.y + this.width;
//         const y2 = this.y + this.height;

//         // Check if mouse is within the overall box bounds (with padding)
//         if (mouseX === null || mouseY === null) {
//             return CanvasPosition.NotOn;
//         }

//         if (mouseX < x1 - this.padding || mouseX > x2 + this.padding ||
//             mouseY < y1 - this.padding || mouseY > y2 + this.padding) {
//             this.lastMousePosition = CanvasPosition.NotOn;
//             return CanvasPosition.NotOn;
//         }

//         // Define helper functions for edge detection
//         const isNearLeft = mouseX >= x1 - this.padding && mouseX <= x1 + this.padding;
//         const isNearRight = mouseX >= x2 - this.padding && mouseX <= x2 + this.padding;
//         const isNearTop = mouseY >= y1 - this.padding && mouseY <= y1 + this.padding;
//         const isNearBottom = mouseY >= y2 - this.padding && mouseY <= y2 + this.padding;

//         // Check corners first (corners have priority over edges)
//         if (isNearLeft && isNearTop) {
//             return CanvasPosition.TopLeftCorner;
//         }
//         if (isNearRight && isNearTop) {
//             return CanvasPosition.TopRightCorner;
//         }
//         if (isNearLeft && isNearBottom) {
//             return CanvasPosition.BottomLeftCorner;
//         }
//         if (isNearRight && isNearBottom) {
//             return CanvasPosition.BottomRightCorner;
//         }

//         // Check edges
//         if (isNearLeft) {
//             return CanvasPosition.LeftEdge;
//         }
//         if (isNearRight) {
//             return CanvasPosition.RightEdge;
//         }
//         if (isNearTop) {
//             return CanvasPosition.TopEdge;
//         }
//         if (isNearBottom) {
//             return CanvasPosition.BottomEdge;
//         }

//         return CanvasPosition.Inside;
//     }

//     updateScreenPosition(screenPosition: Position): void {
//         this.screenPosition.x = screenPosition.x;
//         this.screenPosition.y = screenPosition.y;
//     }

//     resize(gridX: number, gridY: number, mousePosition: number,
//         isMassResize: boolean = false,
//         deltaX: number, deltaY: number): void {

//         if (isMassResize) {
//             if (delta != null) {
//                 console.log('Resizing from top right corner');
//                 this.resizeFromTopRightCorner(this, gridPosition, true, delta, this.originalDimensions);
//             }
//         }

//         else {
//             switch (mousePosition) {
//                 case CanvasPosition.BottomRightCorner:
//                     RectangularDrawableResizing.resizeFromBottomRightCorner(this, gridPosition);
//                     break;

//                 case CanvasPosition.TopLeftCorner:
//                     RectangularDrawableResizing.resizeFromTopLeftCorner(this, gridPosition);
//                     break;

//                 case CanvasPosition.TopRightCorner:
//                     RectangularDrawableResizing.resizeFromTopRightCorner(this, gridPosition, false, delta, this.originalDimensions);
//                     break;

//                 case CanvasPosition.BottomLeftCorner:
//                     RectangularDrawableResizing.resizeFromBottomLeftCorner(this, gridPosition);
//                     break;

//                 // Edges
//                 case CanvasPosition.RightEdge:
//                     RectangularDrawableResizing.resizeFromRightEdge(this, gridPosition);
//                     break;

//                 case CanvasPosition.LeftEdge:
//                     RectangularDrawableResizing.resizeFromLeftEdge(this, gridPosition);
//                     break;

//                 case CanvasPosition.TopEdge:
//                     RectangularDrawableResizing.resizeFromTopEdge(this, gridPosition);
//                     break;

//                 case CanvasPosition.BottomEdge:
//                     RectangularDrawableResizing.resizeFromBottomEdge(this, gridPosition);
//                     break;
//             }
//         }

//     }

//     drawSelectionOutline(context: CanvasRenderingContext2D, x1: number,
//         y1: number, x2: number, y2: number,
//         rounding: number, scale: number, color: string = "skyblue"): void {

//         context.save(); // Save current state
//         context.strokeStyle = color;

//         context.lineWidth = 3;


//         context.setLineDash([20, 16]); // 20px dash, 16px gap

//         context.beginPath();

//         context.moveTo(x1 + this.width / 2, y1); // Start at the middle of the top of the box
//         context.arcTo(x2, y1, x2, y2, rounding);
//         context.arcTo(x2, y2, x1, y2, rounding);
//         context.arcTo(x1, y2, x1, y1, rounding);
//         context.arcTo(x1, y1, x2, y1, rounding);
//         context.closePath();
//         context.stroke();

//         type Point = [number, number];

//         // Corner points
//         const corners: Point[] = [
//             [x1, y1],
//             [x2, y1],
//             [x2, y2],
//             [x1, y2]
//         ];

//         // Midpoints
//         const midpoints: Point[] = [
//             [(x1 + x2) / 2, y1], // Top center
//             [x2, (y1 + y2) / 2], // Right center
//             [(x1 + x2) / 2, y2], // Bottom center
//             [x1, (y1 + y2) / 2]  // Left center
//         ];

//         // Combine the corners list and midpoints list that was calucated.
//         const markerPoints = [...corners, ...midpoints];

//         // Draw all markers as small squares
//         markerPoints.forEach(([cx, cy]: Point) => {
//             context.beginPath();
//             context.arc(cx, cy, 4, 0, Math.PI * 2); // Full circle
//             context.fillStyle = "skyblue";
//             context.fill();
//         });

//         // Sets the canvas settings back to when context.save() was called.
//         context.restore();
//     }

//     public static resizeFromBottomRightCorner(rectDrawable: RectDrawable, x: number, y: number): void {
//         let proposedWidth = x - rectDrawable.x;
//         let proposedHeight = y - rectDrawable.y;

//         if (proposedWidth > rectDrawable.minWidth) {
//             // Update width and height of the box
//             rectDrawable.width = proposedWidth;
//         }

//         if (proposedHeight > rectDrawable.minHeight) {
//             // Update width and height of the box
//             rectDrawable.height = proposedHeight;
//         }
//     }

//     public static resizeFromTopLeftCorner(rectDrawable: RectDrawable, x: number, y: number): void {
//         const fixedX = rectDrawable.x! + rectDrawable.width;
//         const fixedY = rectDrawable.y + rectDrawable.height;

//         const newX = x!;
//         const newY = y;

//         const proposedWidth = fixedX - newX;
//         const proposedHeight = fixedY - newY;

//         rectDrawable.width = Math.max(proposedWidth, rectDrawable.minWidth);
//         rectDrawable.height = Math.max(proposedHeight, rectDrawable.minHeight);

//         rectDrawable.x = fixedX - rectDrawable.width;
//         rectDrawable.y = fixedY - rectDrawable.height;
//     }


//     public static resizeFromTopRightCorner(rectDrawable: RectDrawable,
//         x: number, y: number, isMassResize: boolean = false,
//         originalDimensions: { x: number; y: number; width: number; height: number; } | null): void {

//         if (isMassResize) {
//             console.log('Mass resize');

//             const proposedWidth = originalDimensions!.width;
//             const proposedHeight = originalDimensions!.height; // minus for top

//             rectDrawable.width = Math.max(proposedWidth, rectDrawable.minWidth);
//             rectDrawable.height = Math.max(proposedHeight, rectDrawable.minHeight);
//             rectDrawable.y = originalDimensions!.y;
//         }

//         else {
//             const fixedX = rectDrawable.x;
//             const fixedY = rectDrawable.y + rectDrawable.height;

//             const newX = x;
//             const newY = y;

//             const proposedWidth = newX - fixedX;
//             const proposedHeight = fixedY - newY;

//             rectDrawable.width = Math.max(proposedWidth, rectDrawable.minWidth);
//             rectDrawable.height = Math.max(proposedHeight, rectDrawable.minHeight);

//             rectDrawable.y = fixedY - rectDrawable.height;
//         }
//     }

//     public static resizeFromBottomLeftCorner(rectDrawable: RectDrawable, x: number, y: number): void {
//         const fixedX = rectDrawable.x! + rectDrawable.width;
//         const fixedY = rectDrawable.y;

//         const newX = x;
//         const newY = y;

//         const proposedWidth = fixedX - newX;
//         const proposedHeight = newY - fixedY;

//         rectDrawable.width = Math.max(proposedWidth, rectDrawable.minWidth);
//         rectDrawable.height = Math.max(proposedHeight, rectDrawable.minHeight);

//         rectDrawable.x = fixedX - rectDrawable.width;
//     }



//     public static resizeFromRightEdge(rectDrawable: RectDrawable, x: number, y: number): void {
//         const proposedWidth = x! - rectDrawable.x!;
//         rectDrawable.width = Math.max(proposedWidth, rectDrawable.minWidth);
//     }


//     public static resizeFromLeftEdge(rectDrawable: RectDrawable, x: number, y: number): void {
//         const fixedRightX = rectDrawable.x! + rectDrawable.width;
//         const newX = x;
//         const proposedWidth = fixedRightX - newX;

//         rectDrawable.width = Math.max(proposedWidth, rectDrawable.minWidth);
//         rectDrawable.x = fixedRightX - rectDrawable.width;
//     }

//     public static resizeFromBottomEdge(rectDrawable: RectDrawable, x: number, y: number): void {
//         const proposedHeight = y - rectDrawable.y;
//         rectDrawable.height = Math.max(proposedHeight, rectDrawable.minHeight);
//     }

//     public static resizeFromTopEdge(rectDrawable: RectDrawable, x: number, y: number): void {
//         const fixedBottomY = rectDrawable.y + rectDrawable.height;
//         const newY = y;
//         const proposedHeight = fixedBottomY - newY;

//         rectDrawable.height = Math.max(proposedHeight, rectDrawable.minHeight);
//         rectDrawable.y = fixedBottomY - rectDrawable.height;
//     }
// }