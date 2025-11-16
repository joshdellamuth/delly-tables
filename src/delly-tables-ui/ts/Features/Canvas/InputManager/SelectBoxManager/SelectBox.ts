import { Position } from '../../Shared/Position.ts';

export class SelectBox {
    public x1: number | null = null;
    public y1: number | null = null;
    public w: number | null = null;
    public h: number | null = null;

    constructor(x1: number, y1: number, w: number, h: number) {
        this.x1 = x1;
        this.y1 = y1;
        this.w = w;
        this.h = h;
    }
}