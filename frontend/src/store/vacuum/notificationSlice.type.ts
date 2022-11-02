export type LifeSpanDeviceType = 'brush' | 'sideBrush' | 'heap' | 'unitCare' | 'dModule';
export type LifeSpanAccessoryType = 'mop' | 'dust_bag';

export interface LifeSpanDevice {
  type: LifeSpanDeviceType;
  left: number;
  total: number;
}

export interface LifespanAccessory {
  name: LifeSpanAccessoryType;
  needToBeChanged: boolean;
}

export type BotEventType = 1007 | 1015 | 1021 | 1026 | 1027 | 1052 | 1053 | 1071 | 1070 | 1061 | 1062 | 1068 | 1088;

export interface BotNotification<T> {
  id: number;
  code: T;
  timestamp: string;
}

export type BotNotificationLabel<T extends string | number | symbol> = {
  [key in T]: string;
};

//TODO replace by key for i18n
export const EVENT_LABEL_LIST: BotNotificationLabel<BotEventType> = {
  1007: 'Mop plugged.',
  1015: 'unkown (1015).',
  1052: 'Time to change the mop.',
  1053: 'Obstacle? (1053)',
  1021: 'Cleaning complete.',
  1026: 'unkown (1026).',
  1027: 'Unable de find the charging dock, returning to starting position.',
  1071: 'Position updated.',
  1070: 'Position retrieved after being lift? (1070)',
  1062: 'Unable de locate, starting new map.',
  1061: 'Resuming cleaning after position retrieved.',
  1068: 'Failed to find position, returning to charge.',
  1088: 'Failed to find position.',
};

export type BotErrorType = 0 | 102 | 104 | 109 | 20003 | 20011 | 20012;

export const ERROR_LABEL_LIST: BotNotificationLabel<BotErrorType> = {
  0: 'All good.',
  102: 'Robot as been lift off.',
  104: 'Please clean the anti-drop sensor.',
  109: 'unkown error (109).',
  20003: 'Task type not supported.',
  20011: 'Handle deal message fail.',
  20012: 'Get point count out of range.',
};
