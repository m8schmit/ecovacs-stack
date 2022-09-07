import { Server, Socket } from 'socket.io';

import { charge, clean, getBattery, GetChargeState, getCleanInfo, getMajorMap } from '../mqttClient/commands/commands';
import { ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData } from './websockerServer.type';

export let WSsocket: Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;
const websocketServer = () => {
  const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(3000, {
    cors: {
      origin: 'http://localhost:4200',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    WSsocket = socket;
    console.log('New client connected', socket.id);

    //Ask all basic info when an user open the frontend app
    setInterval(() => {
      console.log('BASIC INFOS');
      getCleanInfo();
      GetChargeState();
      getBattery();
    }, 60000);

    socket.conn.on('close', (reason) => {
      console.log('Client Disconeccted', socket.id, reason);
    });

    socket.on('getMajorMap', () => {
      console.log('receive getMajorMap');
      getMajorMap();
    });

    socket.on('clean', (payload) => {
      console.log('receive clean');
      clean(payload);
    });

    socket.on('charge', () => {
      console.log('receive charge');
      charge();
    });
  });
};

export default websocketServer;
