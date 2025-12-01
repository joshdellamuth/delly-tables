import { CanvasPosition } from '../../Shared/CanvasPosition.ts';

// #region Interfaces
export interface IMouse {
    setStyleByHoveringStatus(hoveringStatus: CanvasPosition | string): void;
    setStyleMove(): void;
    setStyleGrabbing(): void;
    setStyleGrab(): void;
    setStyleCrosshair(): void;
    setStyleCrosshair(): void;
    setStyleCursor(): void;
    setStyleDefault(): void;
}

// #endregion

export class Mouse implements IMouse {
    private _canvas: HTMLCanvasElement;

    constructor(canvas: HTMLCanvasElement) {
        this._canvas = canvas;
    }

    setStyleByHoveringStatus(hoveringStatus: number): void {

        switch (hoveringStatus) {
            case CanvasPosition.BottomEdge:
            case CanvasPosition.TopEdge:
                this._canvas.style.cursor = 'n-resize';
                break;
            case CanvasPosition.RightEdge:
            case CanvasPosition.LeftEdge:
                this._canvas.style.cursor = 'w-resize';
                break;
            case CanvasPosition.TopLeftCorner:
                this._canvas.style.cursor = 'nw-resize';
                break;
            case CanvasPosition.TopRightCorner:
                this._canvas.style.cursor = 'ne-resize';
                break;
            case CanvasPosition.BottomLeftCorner:
                this._canvas.style.cursor = 'sw-resize';
                break;
            case CanvasPosition.BottomRightCorner:
                this._canvas.style.cursor = 'se-resize';
                break;
            case CanvasPosition.Inside:
                this._canvas.style.cursor = 'move';
                break;
            case CanvasPosition.NotOn:
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

    setStyleCrosshair(): void {
        this._canvas.style.cursor = 'crosshair';
    }

    setStyleCursor(): void {
        this._canvas.style.cursor = 'text';
    }

    setStyleDefault(): void {
        this._canvas.style.cursor = 'default';
    }
}