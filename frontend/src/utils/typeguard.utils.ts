import { CleanStateContent } from '../store/vacuum/vacuumSlice.type';

export const isCleanStateContent = (data: any): data is CleanStateContent =>
  !!data && ((data as CleanStateContent).value !== null || (data as CleanStateContent).type !== null);

export const isString = (data: any): data is string => !!data && typeof data === 'string';
