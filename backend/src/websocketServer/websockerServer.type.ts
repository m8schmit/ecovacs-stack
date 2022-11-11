import { CleaningType, Schedules } from '../mqttClient/commands/commands.schedules.type';
import {
  AutoEmptyState,
  BatteryState,
  BotAct,
  BotType,
  ChargeState,
  CleanState,
  DevicesCoordinates,
  LifeSpanDevice,
  LifeSpanDeviceType,
  MapSubSet,
  MapTracesList,
} from '../mqttClient/commands/commands.type';
import { Maybe } from '../mqttClient/types';
import { BotPattern } from '../mysqlHelper/query.type';

export interface ServerToClientEvents {
  vacuumMap: (params: { image: string; id: string }) => void;
  chargePos: (coordinates: DevicesCoordinates[]) => void;
  botPos: (coordinates: DevicesCoordinates) => void;
  batteryLevel: (batteryState: BatteryState) => void;
  status: (status: CleanState) => void;
  chargeState: (chargeState: ChargeState) => void;
  mapSubSet: (mapSubSet: MapSubSet) => void;
  mapTrace: (mapTracesList: MapTracesList) => void;
  speed: (value: number) => void;
  autoEmpty: (autoEmptyState: AutoEmptyState) => void;
  cleanCount: (value: number) => void;
  schedulesList: (schedulesList: Schedules[]) => void;
  relocateSuccess: () => void;
  waterInfo: (params: { enable: boolean; amount: number; sweepType: number }) => void;
  doNotDisturb: (params: { enable: boolean; start: string; end: string }) => void;
  lifeSpanInfo: (params: LifeSpanDevice[]) => void;
  lifeSpanReminder: (params: any /*todo*/) => void;
  eventList: (eventList: any /*todo*/) => void;
  errorList: (errorList: any /*todo*/) => void;
  savedPatternList: (patternList: BotPattern[]) => void;
}

export interface ClientToServerEvents {
  getMajorMap: () => void;
  clean: (params: { act: BotAct; type: BotType; value: Maybe<string> }) => void;
  charge: () => void;
  setSpeed: (value: number) => void;
  setCleanCount: (value: number) => void;
  setRelocationState: () => void;
  getSchedulesList: () => void;
  addSched_V2: (params: {
    hour: number;
    minute: number;
    repeat: string;
    mid: string;
    type: CleaningType;
    value?: string;
  }) => void;
  editSched_V2: (params: {
    hour: number;
    minute: number;
    repeat: string;
    mid: string;
    type: CleaningType;
    sid: string;
    enable: boolean;
    value?: string;
  }) => void;
  getMapTrace: (traceStart: number) => void;
  delSched_V2: (params: { sid: string }) => void;
  emptyDustBin: () => void;
  setWaterInfo: (params: { amount?: number; sweepType?: number }) => void;
  getLifeSpanDevice: () => void;
  getLifeSpanAccessory: () => void;
  resetLifeSpan: (type: LifeSpanDeviceType) => void;
  getEventsList: () => void;
  dismissEvent: (id: number | null) => void;
  getErrorsList: () => void;
  dismissError: (id: number | null) => void;
  savePattern: (pattern: BotPattern) => void;
  getSavedPattern: () => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  name: string;
  age: number;
}
