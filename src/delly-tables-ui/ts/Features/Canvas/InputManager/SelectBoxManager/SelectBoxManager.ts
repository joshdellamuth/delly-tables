import { IDrawable } from '../../Drawables/IDrawable.ts';
import { Position } from '../../Shared/Position.ts';
import { SelectBox } from './SelectBox.ts';

export class SelectBoxManager {

    private startCoordinates: Position = new Position(null, null);
    public isDrawing: boolean = false;
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private selectBox: SelectBox | null = null;

    constructor(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = ctx;
    }

    public startSelectBox(mouseGridPos: Position): void {
        this.isDrawing = true;
        this.startCoordinates.x = mouseGridPos.x;
        this.startCoordinates.y = mouseGridPos.y;
    }

    public stopSelectBox(): void {
        this.isDrawing = false;
        this.startCoordinates.x = null;
        this.startCoordinates.y = null;
        this.selectBox = null;
    }


    public drawSelectBox(startPosition: Position): void {
        console.log('drawSelectBox');
        const x = Math.min(startPosition.x!, this.startCoordinates.x!);
        const y = Math.min(startPosition.y!, this.startCoordinates.y!);
        const w = Math.abs(this.startCoordinates.x! - startPosition.x!);
        const h = Math.abs(this.startCoordinates.y! - startPosition.y!);

        this.selectBox = new SelectBox(
            x, y, w, h
        );

        this.ctx.fillStyle = 'rgba(129, 161, 212, 0.1)';
        this.ctx.fillRect(x, y, w, h);
        this.ctx.strokeStyle = 'rgba(114, 153, 214, 1)';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(x, y, w, h);
    }

    public getDrawablesInSelectBox(drawables: IDrawable[]): IDrawable[] {
        console.log('getDrawablesInSelectBox');
        let drawablesInBox = drawables.filter(d => this.isInside(d));

        return drawablesInBox;
    }

    public isInside(drawable: IDrawable): boolean {
        if (this.selectBox === null) return false;
        // Each of the points of the drawable. 
        const dx1 = drawable.gridPosition.x;
        const dy1 = drawable.gridPosition.y;
        const dx2 = drawable.gridPosition.x! + drawable.width;
        const dy2 = drawable.gridPosition.y! + drawable.height;

        const rx1 = this.selectBox!.x1;
        const ry1 = this.selectBox!.y1;
        const rx2 = this.selectBox!.x1! + this.selectBox!.w!;
        const ry2 = this.selectBox!.y1! + this.selectBox!.h!;

        return dx1! >= rx1! &&
            dy1! >= ry1! &&
            dx2 <= rx2 &&
            dy2 <= ry2;
    }

}


