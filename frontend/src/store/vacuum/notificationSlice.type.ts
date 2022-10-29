export type LifeSpanDeviceType = 'brush' | 'sideBrush' | 'heap' | 'unitCare' | 'dModule';

export interface LifeSpanDevice {
  type: LifeSpanDeviceType;
  left: number;
  total: number;
}

export type BotEventType = 1007 | 1015 | 1021 | 1052 | 1053 | 1071 | 1061 | 1062 | 1068 | 1088;

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
  1007: 'Mop plugged.',
  1015: 'unkown (1015).',
  1052: 'Time to change the mop.',
  1053: 'Obstacle? (1053)',
  1021: 'unkown (1021).',
  1071: 'Position updated.',
  1062: 'Unable de locate, starting new map.',
  1061: 'Resuming cleaning after position retrieved.',
  1068: 'Failed to find position, returning to charge.',
  1088: 'Failed to find position.',
};
