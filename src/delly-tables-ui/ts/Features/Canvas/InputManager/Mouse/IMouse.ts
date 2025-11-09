import { PositionOnDrawable } from '../../Shared/PositionOnDrawable.ts';

export interface IMouse {
    setStyleByHoveringStatus(hoveringStatus: PositionOnDrawable | string): void;
    setStyleMove(): void;
    setStyleGrabbing(): void;
    setStyleGrab(): void;
    setStyleDefault(): void;
}
