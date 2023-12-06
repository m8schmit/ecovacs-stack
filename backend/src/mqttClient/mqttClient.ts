import { connect, MqttClient } from 'mqtt';

import { addBotEvent, getBotEvent } from '../mysqlHelper/botEvent.query';
import { updateReminder } from '../mysqlHelper/botReminder.query';
import { WSsocket } from '../websocketServer/websocketServer';
import { BotInfo } from './botInfo/botInfo';
import {
  getLifeSpan,
  getMapInfo,
  getMapSet,
  getMapSubSet,
  getMinorMap,
  getSched_V2,
  getSingleInfo,
} from './commands/commands.get';
import { CHANGE_MOP_REMINDER_EVENT, RELOCATE_SUCCESS_EVENT } from './commands/event.type';
import { decompressLZMA } from './map/LZMA.utils';
import { parseTracePoints, VacuumMap } from './map/map';
import { getDatafromMessage, getLogs, isTopic } from './mqtt.utils';
import { formatStringSubset } from './subset.utils';
import { Maybe } from './types';

export let client: MqttClient;

const mqttClient = () => {
  client = connect('mqtts://localhost:8883', {rejectUnauthorized: false});
  console.info('starting Backend MQTT client');
  let vacuumMap: Maybe<VacuumMap> = null;
  let botInfo = new BotInfo();

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
    // filters some message I don't need
    // if (!isTopic('onMapTrace', topic) && !isTopic('onMinorMap', topic) && !isTopic('onPos', topic)) {
    getLogs(topic, message);
    // }

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

    if (isTopic('AutoEmpty', topic)) {
      const res = getDatafromMessage(message);
      // console.log('autoEmpty ', inspect(res, false, null, true));
      /**
       *
       * status
       * 0 disable
       * 1 enable
       * 2 dust bag not full
       * 5 dust bag need to be changed
       */
      if (res) {
        if (res.status === 5) {
          updateReminder('dust_bag', true).then(() =>
            WSsocket?.emit('lifeSpanReminder', { name: 'dust_bag', needToBeChanged: true }),
          );
        } else if (res.status === 2) {
          updateReminder('dust_bag', false).then(() =>
            WSsocket?.emit('lifeSpanReminder', { name: 'dust_bag', needToBeChanged: false }),
          );
        }
        WSsocket?.emit('autoEmpty', { active: res.status !== 0, enable: res.enable === 1, bagFull: res.status === 5 });
      }
    }

    if (isTopic('onFwBuryPoint', topic)) {
      const res = getDatafromMessage(message);
      const parsedContent = JSON.parse(res.content);

      if (parsedContent?.d?.body?.data?.d_val?.act === 'online') {
        //TODO Delay some command after this trigger
        const splittedTopic = topic.split('/');
        botInfo.info = {
          ready: true,
          botId: splittedTopic[3],
          botClass: splittedTopic[4],
          botResource: splittedTopic[5],
        };
        console.log('Bot is ready!!', botInfo.info);
      }
    }

    if (isTopic('onEvt', topic)) {
      const res = getDatafromMessage(message);
      // console.log('onEvt ', inspect(res, false, null, true));
      if (res.code === RELOCATE_SUCCESS_EVENT) {
        WSsocket?.emit('relocateSuccess');
      }
      if (res.code === CHANGE_MOP_REMINDER_EVENT) {
        updateReminder('mop', true).then(() =>
          WSsocket?.emit('lifeSpanReminder', { name: 'mop', needToBeChanged: true }),
        );
      }
      addBotEvent(res.code, 'EVENT');
      getBotEvent().then((res: any) => WSsocket?.emit('eventList', res));
    }

    if (isTopic('onError', topic)) {
      const res = getDatafromMessage(message);
      const errorArray = res.code.filter((curr: number) => curr !== 0);

      errorArray.length && addBotEvent(errorArray, 'ERROR');
      getBotEvent().then((res: any) => WSsocket?.emit('eventList', res));
    }

    if (isTopic('onMapInfo', topic)) {
      const res = getDatafromMessage(message);
    }

    if (isTopic('setMapSubSet', topic)) {
      if (!vacuumMap) return;

      //rooms
      getMapSet(vacuumMap.settings.mid, 'ar');
      // no mop zone/wall
      getMapSet(vacuumMap.settings.mid, 'mw');
      // no go zone/wall
      getMapSet(vacuumMap.settings.mid, 'vw');
      // ???
      getMapSet(vacuumMap.settings.mid, 'svw');
    }

    /* Maybe find a better way to avoid code repetition */
    if (isTopic('getInfo', topic)) {
      const res = getDatafromMessage(message);
      res &&
        Object.keys(res).forEach((key) => {
          switch (key) {
            case 'getCleanInfo':
              WSsocket?.emit('status', { state: res[key].data.state, cleanState: res[key].data.cleanState });
              break;
            case 'getChargeState':
              WSsocket?.emit('chargeState', res[key].data);
              break;
            case 'getBattery':
              WSsocket?.emit('batteryLevel', res[key].data);
              break;
            case 'getSpeed':
              WSsocket?.emit('speed', res[key].data);
              break;
            case 'getCleanCount':
              WSsocket?.emit('cleanCount', res[key].data);
              break;
            case 'getWaterInfo':
              const enable = !!res[key].data.enable;
              WSsocket?.emit('waterInfo', {
                enable,
                amount: res[key].data.amount,
                sweepType: res[key].data.sweepType,
              });
              break;
            case 'getCachedMapInfo':
              WSsocket?.emit('cachedMapInfo', res[key].data);
              break;
          }
        });
    }

    if (isTopic('getLifeSpan', topic)) {
      const res = getDatafromMessage(message);
      WSsocket?.emit('lifeSpanInfo', res);
    }

    if (isTopic('resetLifeSpan', topic)) {
      // const res = getDatafromMessage(message);
      getLifeSpan(['brush', 'sideBrush', 'heap', 'unitCare', 'dModule']);
    }

    if (isTopic('getAIMap', topic)) {
      const res = getDatafromMessage(message);
      console.log(res);
      if (res.pointValue.length) {
        WSsocket.emit('obstacleList', res.pointValue);
      }
    }

    if (isTopic('onCachedMapInfo', topic)) {
      const res = getDatafromMessage(message);

      WSsocket?.emit('mapActionFinished');
      WSsocket?.emit('cachedMapInfo', res);
    }
  });

  const handleMap = async (topic: string, message: Buffer) => {
    if (isTopic('getMajorMap', topic)) {
      const res = getDatafromMessage(message);
      if (res) {
        if (!vacuumMap) {
          vacuumMap = new VacuumMap(res);
        }

        if (!vacuumMap.piecesIDsList) {
          console.info('TODO: handle no map case.');
          return;
        }
        vacuumMap?.piecesIDsList.forEach((pieceID) => {
          vacuumMap && getMinorMap(pieceID, vacuumMap.settings);
        });

        //rooms
        getMapSet(vacuumMap.settings.mid, 'ar');
        // no mop zone/wall
        getMapSet(vacuumMap.settings.mid, 'mw');
        // no go zone/wall
        getMapSet(vacuumMap.settings.mid, 'vw');
        // ???
        getMapSet(vacuumMap.settings.mid, 'svw');

        // getMapInfo_V2(vacuumMap.settings.mid);
        getMapInfo(vacuumMap.settings.mid);
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

      // TODO find a better solution
      WSsocket?.emit('botSerialInfo', botInfo.info);
    }

    if (isTopic('MapTrace', topic)) {
      const res = getDatafromMessage(message);
      if (res) {
        const decodedTrace = await parseTracePoints(res.traceValue, res.traceStart);
        WSsocket?.emit('mapTrace', {
          newEntriesList: decodedTrace,
          totalCount: res.totalCount,
          /* if this is a response to a getMapTrace, we increment the 'traceStart' value to ask the next 200 points */
          isResponse: !!isTopic('getMapTrace', topic),
        });
      } else {
        console.log('TODO fix error 20012');
      }
    }

    if (isTopic('getMapSubSet', topic)) {
      const res = getDatafromMessage(message);
      const type = res?.type;

      type === 'ar' &&
        decompressLZMA(res.value).then((value) =>
          WSsocket?.emit(`mapSubSet`, {
            ...res,
            value: value
              .toString()
              .split(';')
              .map((current) => current.split(',')),
          }),
        );

      type === 'mw' && WSsocket?.emit(`NoMopMapSubSet`, { ...res, value: formatStringSubset(res.value) });
      type === 'vw' && WSsocket?.emit(`NoGoMapSubSet`, { ...res, value: formatStringSubset(res.value) });
    }

    if (isTopic('MapSet', topic)) {
      const res = getDatafromMessage(message);
      const type = res?.type;
      res?.subsets?.forEach((subset: { totalcount: number; name: string; mssid: string }) => {
        getMapSubSet(res.msid, subset.totalcount, res.mid, subset.mssid, type);
      });
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
      if (!res.enable) {
        updateReminder('mop', false);
      }
    }

    if (isTopic('setWaterInfo', topic)) {
      getSingleInfo('getWaterInfo');
    }
  };

  return client;
};

export default mqttClient;
