import { connect } from 'mqtt';

//TODO generate real certificat.
// Don't work in Firefox
const MQTTService = () => {
  const client = connect('mqtts://mq-ww.ecouser.net:8883', { rejectUnauthorized: false, clientId: 'FrontBot' });
  console.info('starting Frontend MQTT client');

  client.on('connect', () => {
    console.log('connected');
    client.subscribe('iot/frontend/responses', (err) => {
      if (!err) {
        client.publish('iot/frontend/query', 'hello!');
      }
    });
    // will write on iot/frontend/query
  });

  client.on('error', (err) => {
    console.log('error', err);
  });

  client.on('message', (err) => {
    console.log('message', err);
  });
};

export default MQTTService;
