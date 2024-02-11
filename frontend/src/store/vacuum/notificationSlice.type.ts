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

export type BotEventType = 'ERROR' | 'EVENT';

export type BotEventId =
  | 1007
  | 1011
  | 1015
  | 1021
  | 1032
  | 1024
  | 1026
  | 1027
  | 1051
  | 1052
  | 1053
  | 1057
  | 1067
  | 1071
  | 1070
  | 1061
  | 1062
  | 1068
  | 1081
  | 1084
  | 1088
  | 1092;

export interface BotNotification {
  id: number;
  code: BotEventId | BotErrorId;
  type: BotEventType;
  read: boolean;
  timestamp: string;
}

type BotLabel<T extends string | number | symbol> = {
  [key in T]: string;
};

//TODO replace by key for i18n
export const EVENT_LABEL_LIST: BotLabel<BotEventId> = {
  1007: 'Mop plugged.',
  1011: 'Starting scheduled task.',
  1015: 'unknown (1015).',
  1032: 'Work Interrupted, returning to charge.',
  1052: 'Time to change the mop.',
  1053: 'Task complete, returning to charge.',
  1021: 'Cleaning complete.',
  1024: 'Low battery, returning to charge.',
  1026: 'Work interrupted, robot was blocked.',
  1027: 'Unable de find the charging dock, returning to starting position.',
  1051: 'unknown (1051).',
  1057: 'Work complete, idle.',
  1067: 'Resuming recharging after position retrieved.',
  1071: 'Position updated.',
  1070: 'Position retrieved after being lift? (1070)',
  1062: 'Unable de locate, starting new map.',
  1061: 'Resuming cleaning after position retrieved.',
  1068: 'Failed to find position, returning to charge.',
  1081: 'Merge rooms failed.',
  1084: 'Split room failed.',
  1088: 'Failed to find position.',
  1092: 'Failed to find position after being lift.',
};

export type BotErrorId = 0 | 102 | 103 | 104 | 105 | 109 | 110 | 111 | 20003 | 20011 | 20012;

export const ERROR_LABEL_LIST: BotLabel<BotErrorId> = {
  0: 'All good.',
  102: 'Robot as been lift off.',
  103: 'Driving Wheel malfunction.',
  104: 'Please clean the anti-drop sensor.',
  105: 'Robot is stuck.',
  109: 'Main Brush is tangled.',
  110: 'Dust Band is Missing.',
  111: 'The bumper is stuck.',
  20003: 'Task type not supported.',
  20011: 'Handle deal message fail.',
  20012: 'Get point count out of range.',
};

export const LIFESPAN_LABEL_LIST: BotLabel<LifeSpanDeviceType> = {
  brush: 'Main Brush',
  sideBrush: 'Side Brushes',
  heap: 'Filter and Dust band',
  unitCare: 'Lidar and other sensors',
  dModule: 'Aroma device',
  // mop: 'Mop',
  // dust_bag: 'Dust Bag',
};
