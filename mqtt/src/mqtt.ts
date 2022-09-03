import 'dotenv/config';

import fs from 'fs';
import { connect, MqttClient } from 'mqtt';

import { sendJSONCommand } from './commands/commands';
import { BotCommand } from './commands/commands.model';
import { VacuumMap } from './map/map';
import { makeId } from './text.utils';
import { Maybe } from './types';

const ca = fs.readFileSync('/opt/app/src/ca.crt');

const client = connect('mqtts://request-listener:8883', { ca });
console.info('starting mqtts listener');
let vacuumMap: Maybe<VacuumMap> = null;
let botReady = false;

client.on('connect', () => {
  console.log('connected');

  client.subscribe('iot/atr/#');
  client.subscribe(`iot/cfg/#`);
  client.subscribe(`iot/dtcfg/#`);
  client.subscribe(`iot/dtgcfg/#`);

  client.subscribe(
    `iot/p2p/+/${process.env.BOTID}/${process.env.BOTCLASS}/${process.env.RESOURCE}/+/+/+/p/+/j`,
    (err) => {
      if (!err) {
        // const command: BotCommand = {
        //   name: 'playSound',
        //   payload: { sid: 30 },
        // };
        // const command: BotCommand = {
        //   name: 'clean_V2',
        //   payload: {
        //     act: 'pause',
        //     content: { total: 0, donotClean: 0, count: 0, type: 'auto', bdTaskID: makeId(16) },
        //   },
        // };
        // sendJSONCommand(command, client);
        // BuildMap();

        //get Map
        const getMajorMapCommand: BotCommand = {
          name: 'getMajorMap',
          payload: {},
        };
        sendJSONCommand(getMajorMapCommand, client);
      }
    },
  );
});

client.on('error', (err) => {
  console.log('error', err);
});

client.on('message', (topic, message) => {
  // log message
  console.log(getColoredConsoleLog(topic), message.toString());

  // check if bot is connected
  if (topic.search('iot/atr/') >= 0 && process.env.BOTID && topic.search(process.env.BOTID) >= 0) {
    console.info(`${process.env.BOTID} is ready!`);
  }

  // handle 'getMajorMap'
  if (topic.search('getMajorMap') >= 0) {
    const res = JSON.parse(message.toString()).body.data;
    if (!vacuumMap) {
      vacuumMap = new VacuumMap(res);
    }
    if (!vacuumMap.PiecesIDsList) {
      console.info('TODO: handle no name case.');
      return;
    }
    vacuumMap?.PiecesIDsList.forEach((pieceID) => {
      console.log('ask minor map for ', pieceID);
      const getMinorMapCommand: BotCommand = {
        name: 'getMinorMap',
        payload: {
          pieceIndex: pieceID,
          mid: vacuumMap?.settings.mid,
          type: vacuumMap?.settings.type,
          bdTaskID: makeId(16),
        },
      };
      sendJSONCommand(getMinorMapCommand, client);
    });
  }

  if (topic.search('getMinorMap') >= 0) {
    const res = JSON.parse(message.toString()).body.data;
    vacuumMap?.addMapDataList({ data: res.pieceValue, index: res.pieceIndex });
    if (vacuumMap?.mapDataList.length === vacuumMap?.PiecesIDsList.length) {
      vacuumMap?.buildMap();
    }
  }
});

const getColoredConsoleLog = (topic: string) => {
  let color = 32;
  if (topic.includes('p2p')) {
    color = 36;
  }
  return `\x1b[${color}m[${topic}]\x1b[0m`;
};
