import { MajorMap } from '../map/map.model';
import { client } from '../mqttClient';
import { makeId } from '../text.utils';
import { BotAct, BotCommand, MapSubSetType } from './commands.model';
import { sendJSONCommand } from './commands.utils';

export const clean = (params: BotAct) => {
  const command: BotCommand = {
    name: 'clean_V2',
    payload: {
      act: params,
      content: { total: 0, donotClean: 0, count: 0, type: 'auto', bdTaskID: makeId(16) },
    },
  };
  sendJSONCommand(command, client);
};

export const getMajorMap = () => {
  const command: BotCommand = {
    name: 'getMajorMap',
    payload: {},
  };
  sendJSONCommand(command, client);
};

export const getMapSet = (mid: string) => {
  const command: BotCommand = {
    name: 'getMapSet',
    payload: { start: 0, mid, type: 'ar', bdTaskID: makeId(16) },
  };
  sendJSONCommand(command, client);
};

// q => {"start":0,"mid":"96151110","type":"ar","bdTaskID":"1662563889241531"}
// p =>
// {"type":"ar","count":11,"mid":"96151110","msid":"873210993","subsets":[
//   {"mssid":"0","name":"","totalCount":110},
//   {"mssid":"9","name":"","totalCount":97},
//   {"mssid":"8","name":"","totalCount":132},
//   {"mssid":"10","name":"","totalCount":134},
//   {"mssid":"7","name":"","totalCount":46},
//   {"mssid":"2","name":"","totalCount":51},
//   {"mssid":"12","name":"","totalCount":68},
//   {"mssid":"4","name":"","totalCount":35}
//   ,{"mssid":"3","name":"","totalCount":50},
//   {"mssid":"11","name":"","totalCount":20},
//   {"mssid":"5","name":"","totalCount":53}
// ]}
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
      bdTaskID: makeId(16),
    },
  };
  sendJSONCommand(command, client);
};
// q => "msid":"873210993","values":{},"count":110,"name":"","mid":"96151110","seqIndex":0,"totalCount":110,"type":"ar","mssid":"0","seq":0,"bdTaskID":"1662563890369576"}
// q => {"msid":"873210993","values":{},"count":134,"name":"","mid":"96151110","seqIndex":0,"totalCount":134,"type":"ar","mssid":"10","seq":0,"bdTaskID":"1662563890385713"}
export const getMapInfo_v2 = (mid: string) => {
  const command: BotCommand = {
    name: 'getMapInfo_v2',
    payload: { mid, type: '0', bdTaskID: makeId(16) },
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
      bdTaskID: makeId(16),
    },
  };
  sendJSONCommand(command, client);
};
export const charge = () => {
  const command: BotCommand = {
    name: 'charge',
    payload: { act: 'go', bdTaskID: makeId(16) },
  };
  sendJSONCommand(command, client);
};

export const playSound = () => {
  const command: BotCommand = {
    name: 'getMajorMap',
    payload: {},
  };
  sendJSONCommand(command, client);
};

export const getCleanInfo = () => {
  const command: BotCommand = {
    name: 'getCleanInfo',
    payload: { id: makeId(8) },
  };
  sendJSONCommand(command, client);
};

export const GetChargeState = () => {
  const command: BotCommand = {
    name: 'getChargeState',
    payload: { id: makeId(8) },
  };
  sendJSONCommand(command, client);
};

export const getBattery = () => {
  const command: BotCommand = {
    name: 'getBattery',
    payload: { id: makeId(8) },
  };
  sendJSONCommand(command, client);
};
