import { IDrawable } from '../../Base/Drawable/IDrawable.ts';
import { RectangularDrawable } from '../../Base/Drawable/RectangularDrawable/RectangularDrawable.ts';

export class CanvImage 
    extends RectangularDrawable 
    implements IDrawable {
    
    src: string;
    
    x1: number = null!;
    y1: number = null!;
    x2: number = null!;
    y2: number = null!;

    constructor(id: string, src: string, width: number, height: number,
        xPosition: number, yPosition: number, isSelected: boolean = false) {

        super(id, width, height, xPosition, yPosition, isSelected);

        this.src = src;
    }

    override draw(context: CanvasRenderingContext2D): void {
        if (this.gridPosition.x === null || this.gridPosition.y === null) return;

        var image = new Image();
        image.src = this.src;

        console.log('Trying to draw image at ' + this.gridPosition.x + ', ' + this.gridPosition.y);

        context.drawImage(image, this.gridPosition.x, this.gridPosition.y, this.width, this.height);

        if (this.isSelected) {
            this.x1 = this.gridPosition.x;
            this.y1 = this.gridPosition.y;
            this.x2 = this.gridPosition.x + this.width;
            this.y2 = this.gridPosition.y + this.height;

            super.drawSelectionOutline(context, this.x1, this.y1, this.x2, this.y2, this.rounding);
        }
    }

}