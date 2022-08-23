import { connect } from 'mqtt';

// const client = connect('mqtts://mq-ww.ecouser.net:8883', { rejectUnauthorized: false });
const client = connect('mqtts://192.168.1.170:8883', { rejectUnauthorized: false });
console.info('starting mqtts listener');

client.on('connect', () => {
  client.subscribe('presence', (err) => {
    if (!err) {
      client.publish('presence', 'Hello mqtt');
    }
  });

  client.subscribe('#', (err) => {});
});

client.on('error', (err) => {
  console.log('error', err);
  //   client.end();
});

client.on('message', (topic, message) => {
  // message is Buffer
  console.log(message.toString());
  //   client.end();
});
