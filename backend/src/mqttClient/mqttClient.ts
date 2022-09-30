import { connect, MqttClient } from 'mqtt';
import { inspect } from 'node:util';

import { WSsocket } from '../websocketServer/websocketServer';
import {
  getMapInfo_v2,
  getMapSet,
  getMapSubSet,
  getMinorMap,
  getSched_V2,
  getSingleInfo,
} from './commands/commands.get';
import { RELOCATE_SUCCESS_EVENT } from './commands/event.type';
import { decompressLZMA } from './map/LZMA.utils';
import { parseTracePoints, VacuumMap } from './map/map';
import { getColoredConsoleLog, getDatafromMessage, isTopic } from './mqtt.utils';
import { Maybe } from './types';

export let client: MqttClient;

const mqttClient = () => {
  client = connect('mqtts://localhost:8883');
  console.info('starting Backend MQTT client');
  let vacuumMap: Maybe<VacuumMap> = null;
  let botReady = false;

  client.on('connect', () => {
    console.log('connected');

    client.subscribe('iot/atr/#');
    client.subscribe(`iot/cfg/#`);
    client.subscribe(`iot/dtcfg/#`);
    client.subscribe(`iot/dtgcfg/#`);
    client.subscribe(`iot/p2p/+/${process.env.BOTID}/${process.env.BOTCLASS}/${process.env.RESOURCE}/+/+/+/p/+/+`);
    client.subscribe(`iot/p2p/+/+/+/+/${process.env.BOTID}/${process.env.BOTCLASS}/${process.env.RESOURCE}/q/+/j`);
  });

  client.on('error', (err) => {
    console.log('error', err);
  });

  client.on('message', (topic, message) => {
    // log message
    console.log(getColoredConsoleLog(topic), message.toString());

    handleMap(topic, message);

    handleSchedule(topic, message);

    handleWaterInfo(topic, message);

    if (isTopic('Battery', topic)) {
      const res = getDatafromMessage(message);
      WSsocket?.emit('batteryLevel', res);
    }

    if (isTopic('CleanInfo', topic)) {
      const res = getDatafromMessage(message);
      WSsocket?.emit('status', { state: res.state, cleanState: res.cleanState });
    }

    if (isTopic('ChargeState', topic)) {
      const res = getDatafromMessage(message);
      WSsocket?.emit('chargeState', res);
    }

    if (isTopic('Speed', topic) && !isTopic('setSpeed', topic)) {
      const res = getDatafromMessage(message);
      WSsocket?.emit('speed', res);
    }

    if (isTopic('CleanCount', topic) && !isTopic('setCleanCount', topic)) {
      const res = getDatafromMessage(message);
      WSsocket?.emit('cleanCount', res);
    }

    if (isTopic('Block', topic) && !isTopic('setBlock', topic)) {
      const res = getDatafromMessage(message);
      WSsocket?.emit('doNotDisturb', { ...res, enable: res.enable === 1 });
    }

    if (isTopic('onAutoEmpty', topic)) {
      const res = getDatafromMessage(message);
      console.log('autoEmpty ', inspect(res, false, null, true));
      //not sure, I receive 0, 1, 2 and 5
      WSsocket?.emit('autoEmpty', { active: res.status === 1, enable: res.enable === 1 });
    }

    if (isTopic('onFwBuryPoint', topic)) {
      const res = getDatafromMessage(message);
      const parsedContent = JSON.parse(res.content);

      const payload = inspect({ ...res, content: { ...parsedContent } }, false, null, true);
      console.log('onFwBuryPoint ', payload);

      if (parsedContent?.d?.body?.data?.d_val?.act === 'online') {
        //TODO Delay some command after this trigger
        console.log('Bot is ready!!');
        botReady = true;
      }
    }

    if (isTopic('onEvt', topic)) {
      const res = getDatafromMessage(message);
      console.log('onEvt ', inspect(res, false, null, true));
      if (res === RELOCATE_SUCCESS_EVENT) {
        WSsocket?.emit('relocateSuccess');
      }
    }

    /* Maybe find a better way to avoid code repetition */
    if (isTopic('getInfo', topic)) {
      const res = getDatafromMessage(message);
      console.log('getInfo ', inspect(res, false, null, true));
      Object.keys(res).forEach((key) => {
        switch (key) {
          case 'getCleanInfo':
            WSsocket?.emit('status', { state: res[key].data.state, cleanState: res[key].data.cleanState });

          case 'getChargeState':
            WSsocket?.emit('chargeState', res[key].data);
          case 'getBattery':
            WSsocket?.emit('batteryLevel', res[key].data);
          case 'getSpeed':
            WSsocket?.emit('speed', res[key].data);

          case 'getCleanCount':
            WSsocket?.emit('cleanCount', res[key].data);

          case 'getWaterInfo':
            WSsocket?.emit('waterInfo', {
              enable: !!res[key].data.enable,
              amount: res[key].data.amount,
              sweepType: res[key].data.sweepType,
            });
        }
      });
    }
  });

  const handleMap = async (topic: string, message: Buffer) => {
    if (isTopic('getMajorMap', topic)) {
      const res = getDatafromMessage(message);
      if (res) {
        if (!vacuumMap) {
          vacuumMap = new VacuumMap(res);
          getMapInfo_v2(vacuumMap.settings.mid);
        }
        if (!vacuumMap.piecesIDsList) {
          console.info('TODO: handle no map case.');
          return;
        }
        vacuumMap?.piecesIDsList.forEach((pieceID) => {
          vacuumMap && getMinorMap(pieceID, vacuumMap.settings);
        });

        getMapSet(vacuumMap.settings.mid);
      }
    }

    if (isTopic('MinorMap', topic)) {
      const res = getDatafromMessage(message);
      if (!res?.pieceValue || !res?.pieceIndex) {
        console.log('minor map is empty');
      } else {
        vacuumMap?.addPiecesIDsList(res.pieceIndex);
        vacuumMap?.addMapDataList({ data: res.pieceValue, index: res.pieceIndex });
        if (vacuumMap?.mapDataList.length && vacuumMap?.mapDataList.length === vacuumMap?.piecesIDsList.length) {
          vacuumMap?.buildMap();
        }
      }
    }

    /* onPos, getPos */
    if (isTopic('Pos', topic)) {
      const res = getDatafromMessage(message);
      WSsocket?.emit('chargePos', res.chargePos);
      WSsocket?.emit('botPos', res.deebotPos);
    }

    if (isTopic('MapTrace', topic)) {
      const res = getDatafromMessage(message);
      const decodedTrace = await parseTracePoints(res.traceValue, res.traceStart);
      WSsocket?.emit('mapTrace', {
        newEntriesList: decodedTrace,
        totalCount: res.totalCount,
        /* if this is a response to a getMapTrace, we increment the 'traceStart' value to ask the next 200 points */
        isResponse: !!isTopic('getMapTrace', topic),
      });
    }

    if (isTopic('MapSubSet', topic)) {
      const res = getDatafromMessage(message);
      decompressLZMA(res.value).then((value) =>
        WSsocket?.emit('mapSubSet', {
          ...res,
          value: value
            .toString()
            .split(';')
            .map((current) => current.split(',')),
        }),
      );
    }

    if (isTopic('MapSet', topic)) {
      const res = getDatafromMessage(message);
      res?.subsets?.forEach((subset: { totalcount: number; name: string; mssid: string }) =>
        getMapSubSet(res.msid, subset.totalcount, res.mid, subset.mssid),
      );
    }
  };

  const handleSchedule = (topic: string, message: Buffer) => {
    if (isTopic('getSched_V2', topic) || isTopic('onSched_V2', topic)) {
      const res = getDatafromMessage(message);
      WSsocket?.emit('schedulesList', res);
    }

    if (isTopic('setSched_V2', topic)) {
      getSched_V2();
    }
  };

  const handleWaterInfo = (topic: string, message: Buffer) => {
    if (isTopic('WaterInfo', topic) && !isTopic('setWaterInfo', topic)) {
      const res = getDatafromMessage(message);
      WSsocket?.emit('waterInfo', { enable: !!res.enable, amount: res.amount, sweepType: res.sweepType });
    }

    if (isTopic('setWaterInfo', topic)) {
      getSingleInfo('getWaterInfo');
    }
  };

  return client;
};

export default mqttClient;
