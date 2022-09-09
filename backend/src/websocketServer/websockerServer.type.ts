import {
  AutoEmptyState,
  BatteryState,
  BotAct,
  BotType,
  ChargeState,
  CleanState,
  DevicesCoordinates,
  MapSubSet,
  MapTracesList,
} from '../mqttClient/commands/commands.model';
import { Maybe } from '../mqttClient/types';

export interface ServerToClientEvents {
  vacuumMap: (image: string) => void;
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
}

export interface ClientToServerEvents {
  getMajorMap: () => void;
  clean: (params: { act: BotAct; type: BotType; value: Maybe<string> }) => void;
  charge: () => void;
  setSpeed: (value: number) => void;
  setCleanCount: (value: number) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  name: string;
  age: number;
}
