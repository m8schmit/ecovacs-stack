import { connect, MqttClient } from 'mqtt';

import { ca } from '../server.utils';
import { getMinorMap } from './commands/commands';
import { VacuumMap } from './map/map';
import { getColoredConsoleLog, getDatafromMessage, isTopic } from './mqtt.utils';
import { Maybe } from './types';

export let client: MqttClient;

const mqttClient = () => {
  client = connect('mqtts://localhost:8883', { ca });
  console.info('starting Backend MQTT client');
  let vacuumMap: Maybe<VacuumMap> = null;
  let botReady = false;

  client.on('connect', () => {
    console.log('connected');

    client.subscribe('iot/atr/#');
    client.subscribe(`iot/cfg/#`);
    client.subscribe(`iot/dtcfg/#`);
    client.subscribe(`iot/dtgcfg/#`);
    client.subscribe(`iot/p2p/+/${process.env.BOTID}/${process.env.BOTCLASS}/${process.env.RESOURCE}/+/+/+/p/+/j`);
  });

  client.on('error', (err) => {
    console.log('error', err);
  });

  client.on('message', (topic, message) => {
    // log message
    console.log(getColoredConsoleLog(topic), message.toString());

    // check if bot is connected
    if (isTopic('iot/atr/', topic)) {
      console.info(`${process.env.BOTID} is ready!`);
    }

    // handle 'getMajorMap'
    handleMap(topic, message);
  });

  const handleMap = (topic: string, message: Buffer) => {
    if (isTopic('getMajorMap', topic)) {
      const res = getDatafromMessage(message);
      if (res) {
        if (!vacuumMap) {
          vacuumMap = new VacuumMap(res);
        }
        if (!vacuumMap.piecesIDsList) {
          console.info('TODO: handle no name case.');
          return;
        }
        vacuumMap?.piecesIDsList.forEach((pieceID) => {
          console.log('ask minor map for ', pieceID);
          vacuumMap && getMinorMap(pieceID, vacuumMap.settings);
        });
      }
    }

    if (isTopic('MinorMap', topic)) {
      const res = getDatafromMessage(message);
      vacuumMap?.addPiecesIDsList(res.pieceIndex);
      vacuumMap?.addMapDataList({ data: res.pieceValue, index: res.pieceIndex });
      if (vacuumMap?.mapDataList.length && vacuumMap?.mapDataList.length === vacuumMap?.piecesIDsList.length) {
        // TODO add a set timeout
        vacuumMap?.buildMap();
      }
    }
  };
  return client;
};

export default mqttClient;
