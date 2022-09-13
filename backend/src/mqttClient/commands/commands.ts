import { MajorMap } from '../map/map.model';
import { client } from '../mqttClient';
import { makeId } from '../text.utils';
import { Maybe } from '../types';
import { BotAct, BotCommand, BotType, MapSubSetType } from './commands.type';
import { sendJSONCommand } from './commands.utils';

export const clean = (
  params: BotAct,
  type: BotType = 'auto',
  value: Maybe<string> = null /* like mssid,mssid, etc */,
) => {
  const content = { total: 0, donotClean: 0, count: 0, type, bdTaskID: makeId(16) };
  const command: BotCommand = {
    name: 'clean_V2',
    payload: {
      act: params,
      content: value ? { ...content, value } : content,
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

export const setSpeed = (value: number) => {
  const command: BotCommand = {
    name: 'setSpeed',
    payload: { speed: value, bdTaskID: makeId(16) },
  };
  sendJSONCommand(command, client);
};

export const setCleanCount = (value: number) => {
  const command: BotCommand = {
    name: 'setCleanCount',
    payload: { count: value, bdTaskID: makeId(16) },
  };
  sendJSONCommand(command, client);
};

export const setRelocationState = () => {
  const command: BotCommand = {
    name: 'setRelocationState',
    payload: { mode: 'manu', bdTaskID: makeId(16) },
  };
  sendJSONCommand(command, client);
};

export const getSpeed = () => {
  const command: BotCommand = {
    name: 'getSpeed',
    payload: { id: makeId(8) },
  };
  sendJSONCommand(command, client);
};

export const getCleanCount = () => {
  const command: BotCommand = {
    name: 'getCleanCount',
    payload: { id: makeId(8) },
  };
  sendJSONCommand(command, client);
};

export const getSched_V2 = () => {
  const command: BotCommand = {
    name: 'getSched_V2',
    payload: { type: 1, bdTaskID: makeId(16) },
  };
  sendJSONCommand(command, client);
};
