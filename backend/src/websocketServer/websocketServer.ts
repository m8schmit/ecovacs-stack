import { Server, Socket } from 'socket.io';

import {
  addSched_V2,
  charge,
  clean,
  delSched_V2,
  editSched_V2,
  getBattery,
  GetChargeState,
  getCleanCount,
  getCleanInfo,
  getMajorMap,
  getSched_V2,
  getSpeed,
  setCleanCount,
  setRelocationState,
  setSpeed,
} from '../mqttClient/commands/commands';
import { ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData } from './websockerServer.type';

export let WSsocket: Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;
const websocketServer = () => {
  const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(3000, {
    cors: {
      origin: [`http://${process.env.HOST_IP}:4200`, 'http://localhost:4200'],
      methods: ['GET', 'POST'],
    },
  });

  // setInterval(() => {
  //   console.log('BASIC INFOS');
  //   getCleanInfo();
  //   GetChargeState();
  //   getBattery();
  //   getSpeed();
  //   getCleanCount();
  // }, 10000);

  io.on('connection', (socket) => {
    WSsocket = socket;
    console.log('New client connected', socket.id);

    //Ask all basic info when an user open the frontend app
    // find a bettweway to do this

    socket.conn.on('close', (reason) => {
      console.log('Client Disconeccted', socket.id, reason);
    });

    socket.on('getMajorMap', () => {
      console.log('receive getMajorMap');
      getMajorMap();
    });

    socket.on('clean', (payload) => {
      console.log('receive clean ', payload);
      clean(payload.act, payload.type, payload?.value);
    });

    socket.on('charge', () => {
      console.log('receive charge');
      charge();
    });

    socket.on('setSpeed', (payload) => {
      console.log('setSpeed', payload);
      setSpeed(payload);
    });

    socket.on('setCleanCount', (payload) => {
      console.log('setCleanCount', payload);
      setCleanCount(payload);
    });

    //TODO handle `onEvt` success or fail
    socket.on('setRelocationState', () => {
      console.log('setRelocationState');
      setRelocationState();
    });

    socket.on('getSchedulesList', () => {
      console.log('getSchedulesList');
      getSched_V2();
    });

    socket.on('addSched_V2', ({ hour, minute, repeat, mid, type, value }) => {
      console.log('addSched_V2');
      addSched_V2(hour, minute, repeat, mid, type, value);
    });

    socket.on('editSched_V2', ({ hour, minute, repeat, mid, type, sid, enable, value }) => {
      console.log('addSched_V2');
      editSched_V2(hour, minute, repeat, mid, type, sid, +enable, value);
    });

    socket.on('delSched_V2', ({ sid }) => {
      console.log('delSched_V2');
      delSched_V2(sid);
    });
  });
};

export default websocketServer;
