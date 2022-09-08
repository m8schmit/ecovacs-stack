import {
  BatteryState,
  BotAct,
  ChargeState,
  CleanState,
  DevicesCoordinates,
  MapSubSet,
} from '../mqttClient/commands/commands.model';

export interface ServerToClientEvents {
  // noArg: () => void;
  // basicEmit: (a: number, b: string, c: Buffer) => void;
  // withAck: (d: string, callback: (e: number) => void) => void;
  vacuumMap: (image: string) => void;
  chargePos: (coordinates: DevicesCoordinates[]) => void;
  botPos: (coordinates: DevicesCoordinates) => void;
  batteryLevel: (batteryState: BatteryState) => void;
  status: (status: CleanState) => void;
  chargeState: (chargeState: ChargeState) => void;
  mapSubSet: (mapSubSet: MapSubSet) => void;
}

export interface ClientToServerEvents {
  getMajorMap: () => void;
  clean: (command: BotAct) => void;
  charge: () => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  name: string;
  age: number;
}
