import { Position } from '../../Shared/Position.ts';
import { Viewport } from '../Viewport/Viewport.ts';

export class SelectBoxManager {

    private startCoordinates: Position = new Position(null, null);
    public isDrawing: boolean = false;
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;

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
    }


    drawSelectBox(startPosition: Position): void {

        const x = Math.min(startPosition.x!, this.startCoordinates.x!);
        const y = Math.min(startPosition.y!, this.startCoordinates.y!);
        const w = Math.abs(this.startCoordinates.x! - startPosition.x!);
        const h = Math.abs(this.startCoordinates.y! - startPosition.y!);

        this.ctx.fillStyle = 'rgba(129, 161, 212, 0.1)';
        this.ctx.fillRect(x, y, w, h);
        this.ctx.strokeStyle = 'rgba(114, 153, 214, 1)';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(x, y, w, h);
    }
}
