import { PositionOnDrawable } from '../../Shared/CanvasPosition.ts';

export interface IMouse {
    setStyleByHoveringStatus(hoveringStatus: PositionOnDrawable | string): void;
    setStyleMove(): void;
    setStyleGrabbing(): void;
    setStyleGrab(): void;
    setStyleDefault(): void;
}
