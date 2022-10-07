export type LifeSpanDeviceType = 'brush' | 'sideBrush' | 'heap' | 'unitCare' | 'dModule';

export interface LifeSpanDevice {
  type: LifeSpanDeviceType;
  left: number;
  total: number;
}
