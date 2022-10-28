export type LifeSpanDeviceType = 'brush' | 'sideBrush' | 'heap' | 'unitCare' | 'dModule';

export interface LifeSpanDevice {
  type: LifeSpanDeviceType;
  left: number;
  total: number;
}

export type BotEventType = 1007 | 1015 | 1052 | 1071 | 1061 | 1068 | 1088;

export interface BotEvent {
  id: number;
  evt_code: BotEventType;
  timestamp: string;
}

type BotEventLabel = {
  [key in BotEventType]: string;
};

//TODO replace by key for i18n
export const EVENT_LABEL_LIST: BotEventLabel = {
  1007: 'Map plugged.',
  1015: 'unkown.',
  1052: 'Time to change the mop.',
  1071: 'Position updated.',
  1061: 'unkown.',
  1068: 'Failed to find position, returning to charge.',
  1088: 'Failed to find position.',
};
