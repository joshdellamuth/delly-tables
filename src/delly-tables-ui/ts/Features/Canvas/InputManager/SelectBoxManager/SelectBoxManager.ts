import { start } from 'repl';
import { Position } from '../../Shared/Position.ts';
import { Viewport } from '../Viewport/Viewport.ts';

export class SelectBoxManager {

    private startCoordinates: Position = new Position(null, null);
    private mousePosition: Position | null = null;
    public isDrawing: boolean = false;
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private viewport: Viewport = new Viewport();

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


    drawSelectBox(startPosition: Position,
        xDistanceFromOrigin: number, yDistanceFromOrigin: number,
        scale: number): void {

        let end = this.viewport.convertToScreenPos(this.startCoordinates, this.canvas, xDistanceFromOrigin, yDistanceFromOrigin, scale);

        const x = Math.min(startPosition.x!, end.x!);
        const y = Math.min(startPosition.y!, end.y!);
        const w = Math.abs(end.x! - startPosition.x!);
        const h = Math.abs(end.y! - startPosition.y!);

        this.ctx.fillStyle = 'rgba(143, 176, 230, 0.2)';
        this.ctx.fillRect(x, y, w, h);
        this.ctx.strokeStyle = 'rgb(59, 130, 246)';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(x, y, w, h);
    }
}
