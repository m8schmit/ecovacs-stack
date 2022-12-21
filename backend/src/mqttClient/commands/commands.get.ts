import { MajorMap } from '../map/map.model';
import { client } from '../mqttClient';
import { get16LengthId, makeId } from '../text.utils';
import {
  BotCommand,
  BotCommandName,
  LifeSpanDeviceType,
  MapSubSetType,
  MapType,
  PosDevicesType,
} from './commands.type';
import { sendJSONCommand } from './commands.utils';

export const getMapSet = (mid: string, type: MapSubSetType = 'ar') => {
  const command: BotCommand = {
    name: 'getMapSet',
    payload: { start: 0, mid, type, bdTaskID: get16LengthId() },
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

// //not sure yet if it will only return the zone or the wall
// export const getNoGoList = (msid: string, count: number, mid: string, mssid: string) =>
//   getMapSubSet(msid, count, mid, mssid, 'vw');

// export const getNoMopList = (msid: string, count: number, mid: string, mssid: string) =>
//   getMapSubSet(msid, count, mid, mssid, 'mw');

export const getMapInfo_v2 = (mid: string, type: MapType = '0') => {
  const command: BotCommand = {
    name: 'getMapInfo_v2',
    payload: { mid, type, bdTaskID: get16LengthId() },
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

export const getAIMap = () => {
  const command: BotCommand = {
    name: 'getAIMap',
    //pointCount always seems to be 15
    // this a start and an end index for an array lookin like:
    // [
    //   { x: 1775, y: -6125, type: 3, pid: 0, status: 0 },
    //   { x: 6575, y: -4550, type: 3, pid: 1, status: 0 },
    // ],
    // from 'getRecognization:' it seems to be able to recognize 5 object, "type [1, 3, 4, 5, 6]"
    // maybe more there type '9' in `aitypes`
    // 1: ??
    // 3: cloths?
    // 4: chairs?
    // 5: shoes?
    // 6: cables?
    // 9: ??

    // is only updted afterv clening complete
    payload: { pointCount: 30, pointStart: 0, bdTaskID: get16LengthId() },
  };
  sendJSONCommand(command, client);
};
