import { DialogType } from '../store/dialog/dialogSlice';
import { CleanStateContent } from '../store/vacuum/vacuumSlice.type';

export const isCleanStateContent = (data: any): data is CleanStateContent =>
  !!data && ((data as CleanStateContent).value !== null || (data as CleanStateContent).type !== null);

export const isString = (data: any): data is string => !!data && typeof data === 'string';

export const isDialog = <T extends { type: DialogType }>(data: any, type: DialogType): data is T =>
  !!data && (data as T).type === type;

export type Maybe<T> = null | T;
