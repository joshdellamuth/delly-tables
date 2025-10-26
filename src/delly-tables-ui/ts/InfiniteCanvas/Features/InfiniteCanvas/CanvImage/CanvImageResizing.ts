import { CanvImage } from './CanvImage.ts';
import { Position } from '../../../Shared/Position.ts';

export class CanvImageResizing {
    public static resizeFromBottomRightCorner(image: CanvImage, gridPosition: Position): void {
        let proposedWidth = gridPosition.x! - image.gridPosition.x!;
        let proposedHeight = gridPosition.y! - image.gridPosition.y!;

        if (proposedWidth > image.minimumWidth) {
            // Update width and height of the box
            image.width = proposedWidth;
        }

        if (proposedHeight > image.minimumHeight) {
            // Update width and height of the box
            image.height = proposedHeight;
        }
    }

    public static resizeFromTopLeftCorner(image: CanvImage, gridPosition: Position): void {
        const fixedX = image.gridPosition.x! + image.width;
        const fixedY = image.gridPosition.y! + image.height;

        const newX = gridPosition.x!;
        const newY = gridPosition.y!;

        const proposedWidth = fixedX - newX;
        const proposedHeight = fixedY - newY;

        image.width = Math.max(proposedWidth, image.minimumWidth);
        image.height = Math.max(proposedHeight, image.minimumHeight);

        image.gridPosition.x = fixedX - image.width;
        image.gridPosition.y = fixedY - image.height;
    }


    public static resizeFromTopRightCorner(image: CanvImage, gridPosition: Position): void {
        const fixedX = image.gridPosition.x!;
        const fixedY = image.gridPosition.y! + image.height;

        const newX = gridPosition.x!;
        const newY = gridPosition.y!;

        const proposedWidth = newX - fixedX;
        const proposedHeight = fixedY - newY;

        image.width = Math.max(proposedWidth, image.minimumWidth);
        image.height = Math.max(proposedHeight, image.minimumHeight);

        image.gridPosition.y = fixedY - image.height;
    }

    public static resizeFromBottomLeftCorner(image: CanvImage, gridPosition: Position): void {
        const fixedX = image.gridPosition.x! + image.width;
        const fixedY = image.gridPosition.y!;

        const newX = gridPosition.x!;
        const newY = gridPosition.y!;

        const proposedWidth = fixedX - newX;
        const proposedHeight = newY - fixedY;

        image.width = Math.max(proposedWidth, image.minimumWidth);
        image.height = Math.max(proposedHeight, image.minimumHeight);

        image.gridPosition.x = fixedX - image.width;
    }



    public static resizeFromRightEdge(image: CanvImage, gridPosition: Position): void {
        const proposedWidth = gridPosition.x! - image.gridPosition.x!;
        image.width = Math.max(proposedWidth, image.minimumWidth);
    }


    public static resizeFromLeftEdge(image: CanvImage, gridPosition: Position): void {
        const fixedRightX = image.gridPosition.x! + image.width;
        const newX = gridPosition.x!;
        const proposedWidth = fixedRightX - newX;

        image.width = Math.max(proposedWidth, image.minimumWidth);
        image.gridPosition.x = fixedRightX - image.width;
    }

    public static resizeFromBottomEdge(image: CanvImage, gridPosition: Position): void {
        const proposedHeight = gridPosition.y! - image.gridPosition.y!;
        image.height = Math.max(proposedHeight, image.minimumHeight);
    }

    public static resizeFromTopEdge(image: CanvImage, gridPosition: Position): void {
        const fixedBottomY = image.gridPosition.y! + image.height;
        const newY = gridPosition.y!;
        const proposedHeight = fixedBottomY - newY;

        image.height = Math.max(proposedHeight, image.minimumHeight);
        image.gridPosition.y = fixedBottomY - image.height;
    }
}