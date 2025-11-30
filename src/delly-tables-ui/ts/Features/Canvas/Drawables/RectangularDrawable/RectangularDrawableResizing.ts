import { Position } from '../../Shared/Position.ts';
import { IRectangularDrawable } from './IRectangularDrawable.ts';

export class RectangularDrawableResizing {
    public static resizeFromBottomRightCorner(rectangularDrawable: IRectangularDrawable, gridPosition: Position): void {
        let proposedWidth = gridPosition.x! - rectangularDrawable.gridPosition.x!;
        let proposedHeight = gridPosition.y! - rectangularDrawable.gridPosition.y!;

        if (proposedWidth > rectangularDrawable.minimumWidth) {
            // Update width and height of the box
            rectangularDrawable.width = proposedWidth;
        }

        if (proposedHeight > rectangularDrawable.minimumHeight) {
            // Update width and height of the box
            rectangularDrawable.height = proposedHeight;
        }
    }

    public static resizeFromTopLeftCorner(rectangularDrawable: IRectangularDrawable, gridPosition: Position): void {
        const fixedX = rectangularDrawable.gridPosition.x! + rectangularDrawable.width;
        const fixedY = rectangularDrawable.gridPosition.y! + rectangularDrawable.height;

        const newX = gridPosition.x!;
        const newY = gridPosition.y!;

        const proposedWidth = fixedX - newX;
        const proposedHeight = fixedY - newY;

        rectangularDrawable.width = Math.max(proposedWidth, rectangularDrawable.minimumWidth);
        rectangularDrawable.height = Math.max(proposedHeight, rectangularDrawable.minimumHeight);

        rectangularDrawable.gridPosition.x = fixedX - rectangularDrawable.width;
        rectangularDrawable.gridPosition.y = fixedY - rectangularDrawable.height;
    }


    public static resizeFromTopRightCorner(rectangularDrawable: IRectangularDrawable,
        currentGridPosition: Position, isMassResize: boolean = false,
        delta: Position | null = null
        , originalDimensions: { x: number; y: number; width: number; height: number; } | null): void {

        if (isMassResize) {
            console.log('Mass resize');

            //rectangularDrawable.gridPosition.x = rectangularDrawable.width + delta!.x!;


            rectangularDrawable.width = originalDimensions!.width + delta!.x!;
            rectangularDrawable.height = originalDimensions!.height - delta!.y!; // minus for top
            rectangularDrawable.gridPosition.y = originalDimensions!.y + delta!.y!;

            //rectangularDrawable.gridPosition.x! = rectangularDrawable.gridPosition.x! + delta!.x!;
            //rectangularDrawable.gridPosition.y! = rectangularDrawable.gridPosition.y! + delta!.y!;
        }

        else {
            const fixedX = rectangularDrawable.gridPosition.x!;
            const fixedY = rectangularDrawable.gridPosition.y! + rectangularDrawable.height;

            const newX = currentGridPosition.x!;
            const newY = currentGridPosition.y!;

            const proposedWidth = newX - fixedX;
            const proposedHeight = fixedY - newY;

            rectangularDrawable.width = Math.max(proposedWidth, rectangularDrawable.minimumWidth);
            rectangularDrawable.height = Math.max(proposedHeight, rectangularDrawable.minimumHeight);

            rectangularDrawable.gridPosition.y = fixedY - rectangularDrawable.height;
        }
    }

    public static resizeFromBottomLeftCorner(rectangularDrawable: IRectangularDrawable, gridPosition: Position): void {
        const fixedX = rectangularDrawable.gridPosition.x! + rectangularDrawable.width;
        const fixedY = rectangularDrawable.gridPosition.y!;

        const newX = gridPosition.x!;
        const newY = gridPosition.y!;

        const proposedWidth = fixedX - newX;
        const proposedHeight = newY - fixedY;

        rectangularDrawable.width = Math.max(proposedWidth, rectangularDrawable.minimumWidth);
        rectangularDrawable.height = Math.max(proposedHeight, rectangularDrawable.minimumHeight);

        rectangularDrawable.gridPosition.x = fixedX - rectangularDrawable.width;
    }



    public static resizeFromRightEdge(rectangularDrawable: IRectangularDrawable, gridPosition: Position): void {
        const proposedWidth = gridPosition.x! - rectangularDrawable.gridPosition.x!;
        rectangularDrawable.width = Math.max(proposedWidth, rectangularDrawable.minimumWidth);
    }


    public static resizeFromLeftEdge(rectangularDrawable: IRectangularDrawable, gridPosition: Position): void {
        const fixedRightX = rectangularDrawable.gridPosition.x! + rectangularDrawable.width;
        const newX = gridPosition.x!;
        const proposedWidth = fixedRightX - newX;

        rectangularDrawable.width = Math.max(proposedWidth, rectangularDrawable.minimumWidth);
        rectangularDrawable.gridPosition.x = fixedRightX - rectangularDrawable.width;
    }

    public static resizeFromBottomEdge(rectangularDrawable: IRectangularDrawable, gridPosition: Position): void {
        const proposedHeight = gridPosition.y! - rectangularDrawable.gridPosition.y!;
        rectangularDrawable.height = Math.max(proposedHeight, rectangularDrawable.minimumHeight);
    }

    public static resizeFromTopEdge(rectangularDrawable: IRectangularDrawable, gridPosition: Position): void {
        const fixedBottomY = rectangularDrawable.gridPosition.y! + rectangularDrawable.height;
        const newY = gridPosition.y!;
        const proposedHeight = fixedBottomY - newY;

        rectangularDrawable.height = Math.max(proposedHeight, rectangularDrawable.minimumHeight);
        rectangularDrawable.gridPosition.y = fixedBottomY - rectangularDrawable.height;
    }
}