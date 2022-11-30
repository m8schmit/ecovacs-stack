import { client } from '../mqttClient';
import { get14LengthId, get16LengthId } from '../text.utils';
import { Maybe } from '../types';
import { CleaningType } from './commands.schedules.type';
import { BotAct, BotCommand, BotType, LifeSpanDeviceType } from './commands.type';
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

export const go = (params: BotAct, value: Maybe<string> = null /* four numbers */) => {
  const content = { total: 0, donotClean: 0, count: 0, type: 'mapPoint', bdTaskID: get16LengthId() };
  const command: BotCommand = {
    name: 'clean_V2',
    payload: {
      act: params,
      content: value ? { ...content, value } : content,
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

export const playSound = (sid: number) => {
  const command: BotCommand = {
    name: 'playSound',
    payload: { sid },
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

export const EmptyDustBin = () => {
  let command: BotCommand = {
    name: 'setAutoEmpty',
    payload: { act: 'start' },
  };
  sendJSONCommand(command, client);
};

export const editAutoEmpty = (enable: number) => {
  let command: BotCommand = {
    name: 'setAutoEmpty',
    payload: { enable },
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

export const setWaterInfo = (value: { amount?: number; sweepType?: number }) => {
  const command: BotCommand = {
    name: 'setWaterInfo',
    payload: { ...value, bdTaskID: get16LengthId() },
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

export const setLiveLaunchPwd = () => {
  const command: BotCommand = {
    name: 'setLiveLaunchPwd',
    payload: { action: 'verify', pwd: process.env.ENCODED_PASSWORD, bdTaskID: get16LengthId() },
  };
  sendJSONCommand(command, client);
};

export const addSched_V2 = (
  hour: number,
  minute: number,
  repeat: string,
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

export const resetLifeSpan = (type: LifeSpanDeviceType) => {
  const command: BotCommand = {
    name: 'resetLifeSpan',
    payload: {
      type,
    },
  };
  sendJSONCommand(command, client);
};
