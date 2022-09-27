import { Server, Socket } from 'socket.io';

import {
  getAutoEmpty,
  getBattery,
  GetChargeState,
  getCleanCount,
  getCleanInfo,
  getMajorMap,
  getMapTrace,
  getPos,
  getSched_V2,
  getSpeed,
} from '../mqttClient/commands/commands.get';
import {
  addSched_V2,
  charge,
  clean,
  delSched_V2,
  editSched_V2,
  setCleanCount,
  setRelocationState,
  setSpeed,
} from '../mqttClient/commands/commands.set';
import { ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData } from './websockerServer.type';

const intervalDuration = 60000;
let getStatusInfoInterval: NodeJS.Timer;

const getBotStatus = () => {
  getCleanInfo();
  GetChargeState();
  getBattery();
  getSpeed();
  getCleanCount();
};

const getOneTimeBotStatus = () => {
  getMapTrace(0);
  getPos(['chargePos', 'deebotPos']);
  getAutoEmpty();
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
      getMajorMap();
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

    //TODO handle `onEvt` success or fail
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

    socket.on('getMapTrace', (traceStart) => {
      console.log('receive getMapTrace', traceStart);
      getMapTrace(traceStart);
    });
  });
};

export default websocketServer;
