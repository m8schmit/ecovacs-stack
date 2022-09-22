import { time } from 'console';
import { MajorMap } from '../map/map.model';
import { client } from '../mqttClient';
import { get14LengthId, get16LengthId, makeId } from '../text.utils';
import { Maybe } from '../types';
import { CleaningType } from './commands.schedules.type';
import { BotAct, BotCommand, BotType, MapSubSetType } from './commands.type';
import { sendJSONCommand } from './commands.utils';

export const clean = (
  params: BotAct,
  type: BotType = 'auto',
  value: Maybe<string> = null /* like mssid,mssid, etc */,
) => {
  const content = { total: 0, donotClean: 0, count: 0, type, bdTaskID: get16LengthId() };
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
    payload: { start: 0, mid, type: 'ar', bdTaskID: get16LengthId() },
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
export const charge = () => {
  const command: BotCommand = {
    name: 'charge',
    payload: { act: 'go', bdTaskID: get16LengthId() },
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
    payload: { speed: value, bdTaskID: get16LengthId() },
  };
  sendJSONCommand(command, client);
};

export const setAutoEmpty = () => {
  let command: BotCommand = {
    name: 'setAutoEmpty',
    // payload: {enable: 1},
    payload: { act: 'start' },
  };
  sendJSONCommand(command, client);
};

export const setCleanCount = (value: number) => {
  const command: BotCommand = {
    name: 'setCleanCount',
    payload: { count: value, bdTaskID: get16LengthId() },
  };
  sendJSONCommand(command, client);
};

export const setRelocationState = () => {
  const command: BotCommand = {
    name: 'setRelocationState',
    payload: { mode: 'manu', bdTaskID: get16LengthId() },
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

export const setTime = () => {
  const command: BotCommand = {
    name: 'SetTime',
    payload: {
      ts: Date.now(),
      tsInSec: (Date.now() / 1000) >> 0,
    },
  };
  sendJSONCommand(command, client, true);
};

export const getSched_V2 = () => {
  const command: BotCommand = {
    name: 'getSched_V2',
    payload: { type: 1, bdTaskID: get16LengthId() },
  };
  sendJSONCommand(command, client);
};

export const addSched_V2 = (
  hour: number,
  minute: number,
  repeat: string,
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
      // index,
      mid,
      state: 0,
      trigger: 'app',
      content: { jsonStr: JSON.stringify({ content: { type, value } }), name: 'clean' },
      minute,
      sid: get14LengthId(),
      bdTaskID: get16LengthId(),
    },
  };
  sendJSONCommand(command, client);
};

export const editSched_V2 = (
  hour: number,
  minute: number,
  repeat: string,
  index: number,
  mid: string,
  type: CleaningType,
  sid: string,
  enable: number,
  value?: string,
) => {
  const command: BotCommand = {
    name: 'setSched_V2',
    payload: {
      act: 'mod',
      hour,
      enable,
      repeat,
      index,
      mid,
      state: 0,
      trigger: 'app',
      content: { jsonStr: JSON.stringify({ content: { type, value } }), name: 'clean' },
      minute,
      sid,
      bdTaskID: get16LengthId(),
    },
  };
  sendJSONCommand(command, client);
};

export const delSched_V2 = (sid: string) => {
  const command: BotCommand = {
    name: 'setSched_V2',
    payload: {
      act: 'del',
      sid,
    },
  };
  sendJSONCommand(command, client);
};
//add auto
// {"act":"add","hour":8,"enable":1,"repeat":"0000000","index":0,"mid":"96151110","state":0,"trigger":"app","content":{"jsonStr":"{\"content\":{\"type\":\"auto\"}}","name":"clean"},"minute":27,"sid":"16630288794349","bdTaskID":get16LengthId()9479869"}
// {"act":"add","hour":7,"enable":1,"repeat":"0000000","index":1,"mid":"94258964","state":0,"trigger":"app","content":{"jsonStr":"{\"content\":{\"type\":\"auto\",\"value\":null}}","name":"clean"},"minute":50,"sid":"rTQtcezrlvZPf0","bdTaskID":get16LengthId()QUmRG3t"}}
// add spot
// {"act":"add","hour":8,"enable":1,"repeat":"0111100","index":0,"mid":"96151110","state":0,"trigger":"app","content":{"jsonStr":"{\"content\":{\"type\":\"spotArea\",\"value\":\"5\"}}","name":"clean"},"minute":25,"sid":"16630290347074","bdTaskID":get16LengthId()4755961"}
//del
// {"act":"del","hour":9,"enable":0,"repeat":"1110000","index":3,"mid":"0","state":0,"trigger":"app","mapNickName":"","content":{"jsonStr":"{\"content\":{\"type\":\"auto\"},\"router\":\"plan\"}","name":"clean"},"minute":0,"sid":"16616108366157","bdTaskID":get16LengthId()5550503"}
// {"act":"mod","hour":8,"enable":null,"repeat":"0111100","index":0,"mid":"94258964","state":0,"trigger":"app","content":{"jsonStr":"{\"content\":{\"type\":\"spotArea\",\"value\":\"7\"}}","name":"clean"},"minute":30,"bdTaskID":get16LengthId()6xf6bw2"}

//original
// {"act":"add","hour":8,"enable":1,"repeat":"0000000","index":0,"mid":"96151110","state":0,"trigger":"app","content":{"jsonStr":"{\"content\":{\"type\":\"auto\"}}","name":"clean"},"minute":27,"sid":"16630288794349","bdTaskID":get16LengthId()9479869"}}
// {"act":"mod","hour":8,"enable":0,"repeat":"0000000","index":0,"mid":"96151110","state":0,"trigger":"app","mapNickName":"Home v9","content":{"jsonStr":"{\"content\":{\"type\":\"auto\"},\"router\":\"plan\"}","name":"clean"},"minute":27,"sid":"16630288794349","bdTaskID":get16LengthId()4588988"}}
// "act":"mod","hour":9,"enable":0,"repeat":"1110000","index":3,"mid":"0","state":0,"trigger":"app","mapNickName":"","content":{"jsonStr":"{\"content\":{\"type\":\"auto\"},\"router\":\"plan\"}","name":"clean"},"minute":0,"sid":"16616108366157","bdTaskID":get16LengthId()8150348"}}
// {"act":"add","hour":8,"enable":1,"repeat":"0111100","index":0,"mid":"96151110","state":0,"trigger":"app","content":{"jsonStr":"{\"content\":{\"type\":\"spotArea\",\"value\":\"5\"}}","name":"clean"},"minute":25,"sid":"16638058286435","bdTaskID":get16LengthId()4755961"}}
// me
// {"act":"add","hour":8,"enable":1,"repeat":"0000000","index":0,"mid":"94258964","state":0,"trigger":"app","content":{"jsonStr":"{\"content\":{\"type\":\"auto\"}}","name":"clean"},"minute":30,"sid":16638058286435,"bdTaskID":1663805828643531}
// {"act":"add","hour":8,"enable":1,"repeat":"0000000","index":0,"mid":"96151110","state":0,"trigger":"app","content":{"jsonStr":"{\"content\":{\"type\":\"auto\"}}","name":"clean"},"minute":27,"sid":"16630288794349","bdTaskID":"1663028879479869"}}
// {"act":"add","hour":21,"enable":1,"repeat":"0000000","index":0,"mid":"94258964","state":0,"trigger":"app","content":{"jsonStr":"{\"content\":{\"type\":\"auto\",\"value\":null}}","name":"clean"},"minute":0}}

// {"body":{"data":{"ts":1663807200674,"tsInSec":1663807200}},"header":{"pri":2,"tzm":480,"ts":1663807200675,"ver":"0.0.22"}} correctly sended to [iot/p2p/setTime/HelperBot/x/EYGj/bd802ce4-40c6-4943-b33b-58e5b06881f0/kw9ayx/6Ket/q/x/j] !

// set time
// {"data":{"ts":1663808814484,"tsInSec":1663808814}},
