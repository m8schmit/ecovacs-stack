import { MqttClient } from 'mqtt';

import { MajorMap } from '../map/map.model';
import { client } from '../mqttClient';
import { makeId } from '../text.utils';
import { BotCommand } from './commands.model';
import { sendJSONCommand } from './commands.utils';

export const clean = (params: string) => {
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
export const charge = (client: MqttClient) => {
  const command: BotCommand = {
    name: 'charge',
    payload: {},
  };
  sendJSONCommand(command, client);
};

export const playSound = () => {
  const getMajorMapCommand: BotCommand = {
    name: 'getMajorMap',
    payload: {},
  };
  sendJSONCommand(getMajorMapCommand, client);
};
