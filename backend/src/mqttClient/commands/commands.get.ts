import { MajorMap } from '../map/map.model';
import { client } from '../mqttClient';
import { get16LengthId, makeId } from '../text.utils';
import { BotCommand, BotCommandName, LifeSpanDeviceType, MapSubSetType, PosDevicesType } from './commands.type';
import { sendJSONCommand } from './commands.utils';

export const getMapSet = (mid: string) => {
  const command: BotCommand = {
    name: 'getMapSet',
    payload: { start: 0, mid, type: 'ar', bdTaskID: get16LengthId() },
  };
  sendJSONCommand(command, client);
};

export const getMapTrace = (traceStart: number) => {
  //TODO make some test, but this is the limit used by the app.
  const pointCount = 200;

  const command: BotCommand = {
    name: 'getMapTrace',
    payload: { traceStart, pointCount, bdTaskID: get16LengthId() },
  };
  sendJSONCommand(command, client);
};

export const getMapSubSet = (msid: string, count: number, mid: string, mssid: string, type: MapSubSetType = 'ar') => {
  const command: BotCommand = {
    name: 'getMapSubSet',
    payload: {
      msid,
      value: {},
      count,
      mid,
      seqIndex: 0,
      totalCount: count,
      type,
      mssid,
      seq: 0,
      bdTaskID: get16LengthId(),
    },
  };
  sendJSONCommand(command, client);
};

export const getMapInfo_v2 = (mid: string) => {
  const command: BotCommand = {
    name: 'getMapInfo_v2',
    payload: { mid, type: '0', bdTaskID: get16LengthId() },
  };
  sendJSONCommand(command, client);
};

export const getMinorMap = (pieceID: number, { mid, type }: MajorMap) => {
  const command: BotCommand = {
    name: 'getMinorMap',
    payload: {
      pieceIndex: pieceID,
      mid: mid,
      type: type,
      bdTaskID: get16LengthId(),
    },
  };
  sendJSONCommand(command, client);
};

export const getSched_V2 = () => {
  const command: BotCommand = {
    name: 'getSched_V2',
    payload: { type: 1, bdTaskID: get16LengthId() },
  };
  sendJSONCommand(command, client);
};

export const getPos = (posDevices: PosDevicesType[]) => {
  const command: BotCommand = {
    name: 'getPos',
    payload: posDevices,
  };
  sendJSONCommand(command, client);
};

export const getSingleInfo = (commandsName: BotCommandName) => {
  const command: BotCommand = {
    name: commandsName,
    payload: { id: makeId(8) },
  };
  sendJSONCommand(command, client);
};

export const getInfo = (commandsNameList: BotCommandName[]) => {
  let command: BotCommand = {
    name: 'getInfo',
    payload: commandsNameList,
  };
  sendJSONCommand(command, client);
};

export const getLifeSpan = (lifeSpanDeviceList: LifeSpanDeviceType[]) => {
  const command: BotCommand = {
    name: 'getLifeSpan',
    payload: lifeSpanDeviceList,
  };
  sendJSONCommand(command, client);
};
