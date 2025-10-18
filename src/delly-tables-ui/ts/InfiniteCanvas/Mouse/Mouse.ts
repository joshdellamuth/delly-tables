import { PositionOnDrawable } from '../Drawables/PositionOnDrawable.ts';


export class Mouse {
    private _canvas: HTMLCanvasElement;

    constructor(canvas: HTMLCanvasElement) {
        this._canvas = canvas;
    }

    setStyleByHoveringStatus(hoveringStatus: string): void {

        switch (hoveringStatus) {
            case PositionOnDrawable.BottomEdge:
            case PositionOnDrawable.TopEdge:
                this._canvas.style.cursor = 'n-resize';
                break;
            case PositionOnDrawable.RightEdge:
            case PositionOnDrawable.LeftEdge:
                this._canvas.style.cursor = 'w-resize';
                break;
            case PositionOnDrawable.TopLeftCorner:
                this._canvas.style.cursor = 'nw-resize';
                break;
            case PositionOnDrawable.TopRightCorner:
                this._canvas.style.cursor = 'ne-resize';
                break;
            case PositionOnDrawable.BottomLeftCorner:
                this._canvas.style.cursor = 'sw-resize';
                break;
            case PositionOnDrawable.BottomRightCorner:
                this._canvas.style.cursor = 'se-resize';
                break;
            case PositionOnDrawable.Inside:
                this._canvas.style.cursor = 'move';
                break;
            case PositionOnDrawable.NotOn:
                this._canvas.style.cursor = 'default';
                break;
        }
    }

    setStyleMove(): void {
        this._canvas.style.cursor = 'move';
    }

    setStyleGrabbing(): void {
        this._canvas.style.cursor = 'grabbing';
    }

    setStyleGrab(): void {
        this._canvas.style.cursor = 'grab';
    }

    setStyleDefault(): void {
        this._canvas.style.cursor = 'default';
    }
}