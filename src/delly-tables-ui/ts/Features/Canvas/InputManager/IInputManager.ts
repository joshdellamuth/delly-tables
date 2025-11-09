import { IDrawable } from '../Drawables/IDrawable.ts';
import { Position } from '../Shared/Position.ts';

export interface IInputManager {
  readonly mouseScreenPosition: Position;
  readonly mouseGridPosition: Position;
  readonly isPanningActive: boolean;

  toggleShapesButton(): void;
  addDrawables(drawables: IDrawable[]): void;
  setupEventListeners(): void;
  render(): void;
  stopPanning(): void;
}
