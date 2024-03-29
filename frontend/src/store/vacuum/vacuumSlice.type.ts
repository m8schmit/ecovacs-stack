import { Maybe } from '../../utils/typeguard.utils';

// CleanState
export interface CleanState {
  state: BotState;
  cleanState: {
    id?: string /* 3 digits */;
    cid?: string /* 3 digits */;
    router?: BotRoute;
    type?: BotCleanType;
    motionState?: BotMotionState;
    content?: CleanStateContent | string;
    donotclean?: number;
  };
}

export interface CleanStateContent {
  value?: string;
  type?: BotCleanType;
}

type BotState = 'clean' | 'pause' | 'idle' | 'goCharging';
type BotRoute = 'plan';
type BotMotionState = 'working' | 'pause';

// ChargeState
export interface ChargeState {
  isCharging: boolean;
  mode?: botMode;
}

type botMode = 'slot' | 'autoEmpty';

// cleanTask
export interface CleanTask {
  act: BotAct;
  type: BotCleanType;
  value?: string | null /* array of mssid or 4 xy value for a customArea, alway separated by commans */;
}

export type BotAct = 'go' | 'start' | 'stop' | 'resume' | 'pause';
export type BotCleanType = 'auto' | 'spotArea' | 'customArea' | 'mapPoint';

export interface BatteryState {
  level: number;
  isLow: boolean;
}

// AutoEmpty

export interface AutoEmptyState {
  active: boolean;
  enable: boolean;
  bagFull: boolean;
}

//  VacuumingOptionState

export interface VacuumingOptionState {
  speed: number;
  count: number;
}

export interface MoppingOptionsState {
  enable: boolean;
  amount: number;
  sweepType: number;
}

export interface DoNotDisturbState {
  enable: boolean;
  start: string;
  end: string;
}

export interface BotPattern {
  id: number;
  pattern: {
    selected: string;
    type: string;
    name: string;
  };
}

export interface BotSerialInfo {
  ready: boolean;
  botId: Maybe<string>;
  botClass: Maybe<string>;
  botResource: Maybe<string>;
}
