import httpsServer from './httpsServer';
import mqttClient from './mqttClient/mqttClient';
import mqttsServer from './mqttsServer';
import 'dotenv/config';
import websocketServer from './websocketServer/websocketServer';
import httpServer from './httpServer';

httpsServer();
httpServer();
websocketServer();
mqttsServer().then(() => mqttClient());
