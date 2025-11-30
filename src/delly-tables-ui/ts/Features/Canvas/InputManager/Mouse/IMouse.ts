import { CanvasPosition } from '../../Shared/CanvasPosition.ts';

export interface IMouse {
    setStyleByHoveringStatus(hoveringStatus: CanvasPosition | string): void;
    setStyleMove(): void;
    setStyleGrabbing(): void;
    setStyleGrab(): void;
    setStyleCrosshair(): void;
    setStyleCrosshair(): void;
    setStyleDefault(): void;
}
