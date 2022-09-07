import { BatteryState, BotAct, BotStatus, DevicesCoordinates } from '../mqttClient/commands/commands.model';

export interface ServerToClientEvents {
  // noArg: () => void;
  // basicEmit: (a: number, b: string, c: Buffer) => void;
  // withAck: (d: string, callback: (e: number) => void) => void;
  vacuumMap: (image: string) => void;
  chargePos: (coordinates: DevicesCoordinates[]) => void;
  botPos: (coordinates: DevicesCoordinates) => void;
  batteryLevel: (batteryState: BatteryState) => void;
  status: (status: BotStatus) => void;
}

export interface ClientToServerEvents {
  getMajorMap: () => void;
  clean: (command: BotAct) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  name: string;
  age: number;
}
