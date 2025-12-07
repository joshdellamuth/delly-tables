import { IDrawable } from '../IDrawable.ts';
import { RectangularDrawable } from '../RectangularDrawable/RectangularDrawable.ts';
import { Position } from '../../Shared/Position.ts';

export class CanvImage
    extends RectangularDrawable
    implements IDrawable {

    private image: HTMLImageElement;
    private imageLoaded: boolean = false;

    points: Position[] = [];
    x1: number = null!;
    y1: number = null!;
    x2: number = null!;
    y2: number = null!;

    constructor(id: string, src: string, width: number, height: number,
        xPosition: number, yPosition: number) {

        super(id, width, height, xPosition, yPosition);

        this.image = new Image();
        this.image.onload = () => {
            this.imageLoaded = true;
            // Trigger re-render if needed
        };
        this.image.src = src;
    }

    override draw(context: CanvasRenderingContext2D, zoom: number): void {
        this.updatePoints();

        if (this.gridPosition.x === null || this.gridPosition.y === null) return;

        if (!this.imageLoaded) {
            // Draw placeholder
            context.fillStyle = '#ddd';
            context.fillRect(this.gridPosition.x, this.gridPosition.y, this.width, this.height);
            context.fillStyle = '#727272ff';
            context.font = '16px sans-serif';
            context.fillText('Loading...', this.gridPosition.x + 10, this.gridPosition.y + 30);
            return;
        }

        context.drawImage(this.image, this.gridPosition.x, this.gridPosition.y, this.width, this.height);
    }

}