import { Server, Socket } from 'socket.io';

import {
  getAIMap,
  getInfo,
  getLifeSpan,
  getMapTrace,
  getPos,
  getSched_V2,
  getSingleInfo,
} from '../mqttClient/commands/commands.get';
import {
  addSched_V2,
  charge,
  clean,
  delSched_V2,
  editSched_V2,
  EmptyDustBin,
  resetLifeSpan,
  setCleanCount,
  setRelocationState,
  setSpeed,
  setWaterInfo,
} from '../mqttClient/commands/commands.set';
import { delAllBotError, delBotError, getBotError } from '../mysqlHelper/botError.query';
import { delAllBotEvent, delBotEvent, getBotEvent } from '../mysqlHelper/botEvent.query';
import { getAllReminders } from '../mysqlHelper/botReminder.query';
import { addBotPattern, getBotPattern } from '../mysqlHelper/botSavedPattern';
import { ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData } from './websockerServer.type';

const intervalDuration = 60000;
let getStatusInfoInterval: NodeJS.Timer;

// TODO add the same query as the app :
// [getSleep","getError","getSpeed","getCleanCount","getDModule","getCleanPreference","getWaterInfo","getBlock","getBreakPoint","getVoice","getVolume"]
// then getSleep","getError","getSpeed","getCleanCount","getDModule","getCleanPreference","getWaterInfo","getBlock","getBreakPoint","getVoice","getVolume"
// or getInfo ["getRecognization","getMapState","getBattery","getChargeState","getStats"]
const getBotStatus = () => {
  getInfo([
    'getCleanInfo',
    'getChargeState',
    'getBattery',
    'getSpeed',
    'getCleanCount',
    'getWaterInfo',
    'getRecognization',
    'getStats',
  ]);
  getAIMap();
};

const getOneTimeBotStatus = () => {
  getMapTrace(0);
  getPos(['chargePos', 'deebotPos']);
  getSingleInfo('getAutoEmpty');
  getSingleInfo('getBlock');
};

export let WSsocket: Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;
const websocketServer = () => {
  let count: number = 0;
  const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(3000, {
    cors: {
      origin: [`http://${process.env.HOST_IP}:4200`, 'http://localhost:4200'],
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    WSsocket = socket;
    count = socket.rooms.size;
    console.log('WebSocket client connected', socket.id, `(total: ${count})`);

    //TODO stop these query when bot is busy, with relocate for example
    getBotStatus();
    getOneTimeBotStatus();
    if (count) {
      getStatusInfoInterval = setInterval(() => {
        getBotStatus();
      }, intervalDuration);
    }

    socket.conn.on('close', (reason) => {
      count = socket.rooms.size;
      console.log('Client Disconnected', socket.id, reason, `(total: ${count})`);
      if (!count) {
        console.log('stop bot Status');
        clearInterval(getStatusInfoInterval);
      }
    });

    socket.on('getMajorMap', () => {
      getSingleInfo('getMajorMap');
    });

    socket.on('clean', (payload) => {
      clean(payload.act, payload.type, payload?.value);
    });

    socket.on('charge', () => {
      charge();
    });

    socket.on('setSpeed', (payload) => {
      setSpeed(payload);
    });

    socket.on('setCleanCount', (payload) => {
      setCleanCount(payload);
    });

    socket.on('setRelocationState', () => {
      setRelocationState();
    });

    socket.on('getSchedulesList', () => {
      getSched_V2();
    });

    socket.on('addSched_V2', ({ hour, minute, repeat, mid, type, value }) => {
      addSched_V2(hour, minute, repeat, mid, type, value);
    });

    socket.on('editSched_V2', ({ hour, minute, repeat, mid, type, sid, enable, value }) => {
      editSched_V2(hour, minute, repeat, mid, type, sid, +enable, value);
    });

    socket.on('delSched_V2', ({ sid }) => {
      delSched_V2(sid);
    });

    socket.on('emptyDustBin', () => {
      EmptyDustBin();
    });
    socket.on('getMapTrace', (traceStart) => {
      getMapTrace(traceStart);
    });

    socket.on('setWaterInfo', (payload) => {
      setWaterInfo(payload);
    });

    /*
     ** LifeSpan, errors and notifications
     */

    socket.on('getLifeSpanDevice', () => {
      getLifeSpan(['brush', 'sideBrush', 'heap', 'unitCare', 'dModule']);
    });

    socket.on('resetLifeSpan', (type) => {
      console.log('resetLifeSpan of ', type);
      resetLifeSpan(type);
    });

    socket.on('getLifeSpanAccessory', () => {
      getAllReminders().then((res) => {
        console.log('getLifeSpanAccessory ', res);
        socket.emit(
          'lifeSpanReminder',
          (res as any).map((current: any) => ({
            name: current.name,
            needToBeChanged: current.need_to_change === 1,
          })),
        );
      });
    });

    socket.on('getEventsList', () => {
      getBotEvent().then((res) => {
        console.log('getEventsList ', res);
        socket.emit('eventList', res);
      });
    });

    socket.on('getErrorsList', () => {
      getBotError().then((res) => {
        console.log('getErrorsList ', res);
        socket.emit('errorList', res);
      });
    });

    socket.on('dismissEvent', (id) => {
      (id ? delBotEvent(id) : delAllBotEvent()).then(() => getBotEvent().then((res) => socket.emit('eventList', res)));
    });

    socket.on('dismissError', (id) => {
      (id ? delBotError(id) : delAllBotError()).then(() => getBotError().then((res) => socket.emit('errorList', res)));
    });

    /*
     ** Saved clean pattern
     */

    const sendBotSavedPatternList = () => getBotPattern().then((res) => socket.emit('savedPatternList', res as any[]));

    socket.on('getSavedPattern', () => sendBotSavedPatternList());

    socket.on('savePattern', (pattern) => addBotPattern(JSON.stringify(pattern)).then(() => sendBotSavedPatternList()));
  });
};

export default websocketServer;
