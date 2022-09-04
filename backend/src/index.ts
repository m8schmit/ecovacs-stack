import httpsServer from './httpsServer';
import mqttClient from './mqttClient/mqttClient';
import mqttsServer from './mqttsServer';
import 'dotenv/config';
import websocketServer from './websocketServer/websocketServer';

httpsServer();
websocketServer();
mqttsServer().then(() => mqttClient());
