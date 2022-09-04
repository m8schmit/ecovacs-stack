import { Server } from 'socket.io';
import { ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData } from './websockerServer.type';

const websocketServer = () => {
  const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(3000, {
    cors: {
      origin: 'http://localhost:4200',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('New client connected', socket.id);

    socket.conn.on('close', (reason) => {
      console.log('Client Disconeccted', socket.id, reason);
    });
  });
};

export default websocketServer;
