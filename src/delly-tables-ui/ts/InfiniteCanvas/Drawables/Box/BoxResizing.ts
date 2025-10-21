import { Box } from './Box.ts';
import { Position } from '.././../Shared/Position.ts';

export class BoxResizing {
    public static resizeFromBottomRightCorner(box: Box, gridPosition: Position): void {
        let proposedWidth = gridPosition.x! - box.gridPosition.x!;
        let proposedHeight = gridPosition.y! - box.gridPosition.y!;

        if (proposedWidth > box.minimumWidth) {
            // Update width and height of the box
            box.width = proposedWidth;
        }

        if (proposedHeight > box.minimumHeight) {
            // Update width and height of the box
            box.height = proposedHeight;
        }
    }

    public static resizeFromTopLeftCorner(box: Box, gridPosition: Position): void {
        const fixedX = box.gridPosition.x! + box.width;
        const fixedY = box.gridPosition.y! + box.height;

        const newX = gridPosition.x!;
        const newY = gridPosition.y!;

        const proposedWidth = fixedX - newX;
        const proposedHeight = fixedY - newY;

        box.width = Math.max(proposedWidth, box.minimumWidth);
        box.height = Math.max(proposedHeight, box.minimumHeight);

        box.gridPosition.x = fixedX - box.width;
        box.gridPosition.y = fixedY - box.height;
    }


    public static resizeFromTopRightCorner(box: Box, gridPosition: Position): void {
        const fixedX = box.gridPosition.x!;
        const fixedY = box.gridPosition.y! + box.height;

        const newX = gridPosition.x!;
        const newY = gridPosition.y!;

        const proposedWidth = newX - fixedX;
        const proposedHeight = fixedY - newY;

        box.width = Math.max(proposedWidth, box.minimumWidth);
        box.height = Math.max(proposedHeight, box.minimumHeight);

        box.gridPosition.y = fixedY - box.height;
    }

    public static resizeFromBottomLeftCorner(box: Box, gridPosition: Position): void {
        const fixedX = box.gridPosition.x! + box.width;
        const fixedY = box.gridPosition.y!;

        const newX = gridPosition.x!;
        const newY = gridPosition.y!;

        const proposedWidth = fixedX - newX;
        const proposedHeight = newY - fixedY;

        box.width = Math.max(proposedWidth, box.minimumWidth);
        box.height = Math.max(proposedHeight, box.minimumHeight);

        box.gridPosition.x = fixedX - box.width;
    }



    public static resizeFromRightEdge(box: Box, gridPosition: Position): void {
        const proposedWidth = gridPosition.x! - box.gridPosition.x!;
        box.width = Math.max(proposedWidth, box.minimumWidth);
    }


    public static resizeFromLeftEdge(box: Box, gridPosition: Position): void {
        const fixedRightX = box.gridPosition.x! + box.width;
        const newX = gridPosition.x!;
        const proposedWidth = fixedRightX - newX;

        box.width = Math.max(proposedWidth, box.minimumWidth);
        box.gridPosition.x = fixedRightX - box.width;
    }

    public static resizeFromBottomEdge(box: Box, gridPosition: Position): void {
        const proposedHeight = gridPosition.y! - box.gridPosition.y!;
        box.height = Math.max(proposedHeight, box.minimumHeight);
    }

    public static resizeFromTopEdge(box: Box, gridPosition: Position): void {
        const fixedBottomY = box.gridPosition.y! + box.height;
        const newY = gridPosition.y!;
        const proposedHeight = fixedBottomY - newY;

        box.height = Math.max(proposedHeight, box.minimumHeight);
        box.gridPosition.y = fixedBottomY - box.height;
    }
}