import { connect } from 'mqtt';
import fs from 'fs';
import { createServer } from 'https';

// "iot/p2p/[command]/[clientName]/[ecosys = ???]/[bot id]/[bot class]/[bot resource]/[q for request, p for response]/[j for json, x for xml] body: [parameters], header: [pri 2 for query, 1 for response][timestamps][timezone][version of ??]
// const channel1 = `iot/p2p/+/+/+/+/${this.vacuum['did']}/${this.vacuum['class']}/${this.vacuum['resource']}/q/+/j`;
// const channel2 = `iot/p2p/+/${this.vacuum['did']}/${this.vacuum['class']}/${this.vacuum['resource']}/+/+/+/p/+/j`;
// const channel3 = `iot/atr/#`;

const ca = fs.readFileSync('/opt/app/src/ca.crt');

const getHeader = () => ({
  header: {
    pri: 2,
    tzm: 480,
    ts: Date.now(),
    ver: '0.0.22',
  },
});

const botId = 'bd802ce4-40c6-4943-b33b-58e5b06881f0';
const botClass = 'kw9ayx';
const resource = '6Ket';

const getJSONFormatedRequestTopic = (command: string) =>
  `iot/p2p/${command}/fooBot/bar/1234/${botId}/${botClass}/${resource}/q/x/j`;
// iot/p2p/+/+/+/+/bd802ce4-40c6-4943-b33b-58e5b06881f0/kw9ayx/6Ket/+/+/+

const sendJSONCommand = () => {
  const topic = getJSONFormatedRequestTopic('playSound');
  const command = { body: { data: { code: 0 } } };
  const formatedCommand = (command: {}) => JSON.stringify({ ...command, ...getHeader() });
  client.publish(topic, formatedCommand(command), { qos: 0, retain: false }, (err) =>
    err
      ? console.log('sending err: ', err)
      : console.log(`${formatedCommand(command)} correctly sended to [${topic}] !`),
  );
};

const client = connect('mqtts://request-listener:8883', { ca });
console.info('starting mqtts listener');

client.on('connect', () => {
  console.log('connected');

  client.subscribe('iot/atr/#');

  client.subscribe(`iot/p2p/+/${botId}/${botClass}/${resource}/+/+/+/p/+/j`, (err) => {
    if (!err) {
      sendJSONCommand();
    }
  });
});

client.on('error', (err) => {
  console.log('error', err);
});

client.on('message', (topic, message) => {
  console.log(getColoredConsoleLog(topic), message.toString());

  //   client.end();
});

const getColoredConsoleLog = (topic: string) => {
  let color = 42;
  if (topic.includes('p2p')) {
    color = 46;
  }
  return `\x1b[${color}m\x1b[1m\x1b[37m[${topic}]\x1b[0m\x1b[0m\x1b[0m`;
};
