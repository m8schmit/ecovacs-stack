import { MajorMap } from '../map/map.model';
import { client } from '../mqttClient';
import { makeId } from '../text.utils';
import { Maybe } from '../types';
import { CleaningType } from './commands.schedules.type';
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

export const addSched_V2 = (
  hour: number,
  minute: number,
  repeat: number,
  index: number,
  mid: string,
  type: CleaningType,
  value?: string,
) => {
  const command: BotCommand = {
    name: 'setSched_V2',
    payload: {
      act: 'add',
      hour,
      enable: 1,
      repeat,
      index,
      mid,
      state: 0,
      trigger: 'app',
      content: { jsonStr: JSON.stringify({ content: { type, value } }), name: 'clean' },
      minute,
      sid: makeId(14),
      bdTaskID: makeId(16),
    },
  };
  sendJSONCommand(command, client);
};

export const delSched_V2 = (
  hour: number,
  repeat: number,
  index: number,
  mid: string,
  type: CleaningType,
  value?: string,
) => {
  const command: BotCommand = {
    name: 'setSched_V2',
    payload: {
      act: 'del',
      hour,
      enable: 1,
      repeat,
      index,
      mid,
      state: 0,
      trigger: 'app',
      content: { jsonStr: JSON.stringify({ content: { type, value } }), name: 'clean' },
      minute: 27,
      sid: makeId(14),
      bdTaskID: makeId(16),
    },
  };
  sendJSONCommand(command, client);
};
//add auto
// {"act":"add","hour":8,"enable":1,"repeat":"0000000","index":0,"mid":"96151110","state":0,"trigger":"app","content":{"jsonStr":"{\"content\":{\"type\":\"auto\"}}","name":"clean"},"minute":27,"sid":"16630288794349","bdTaskID":"1663028879479869"}
// add spot
// {"act":"add","hour":8,"enable":1,"repeat":"0111100","index":0,"mid":"96151110","state":0,"trigger":"app","content":{"jsonStr":"{\"content\":{\"type\":\"spotArea\",\"value\":\"5\"}}","name":"clean"},"minute":25,"sid":"16630290347074","bdTaskID":"1663029034755961"}
//del
// {"act":"del","hour":9,"enable":0,"repeat":"1110000","index":3,"mid":"0","state":0,"trigger":"app","mapNickName":"","content":{"jsonStr":"{\"content\":{\"type\":\"auto\"},\"router\":\"plan\"}","name":"clean"},"minute":0,"sid":"16616108366157","bdTaskID":"1663028965550503"}
