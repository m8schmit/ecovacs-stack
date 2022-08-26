import { connect } from 'mqtt';
import fs from 'fs';
import { XMLBuilder } from 'fast-xml-parser';

const ca = fs.readFileSync('/opt/app/src/ca.crt');
// bd802ce4-40c6-4943-b33b-58e5b06881f0/kw9ayx/6Ket/j
// {"header":{"pri":1,"tzm":480,"ts":"1661309828436","ver":"0.0.1","fwVer":"1.4.5","hwVer":"0.1.1"},"body":{"data":{"isCharging":0,"mode":"slot"}}}
// {"header":{"pri":1,"tzm":480,"ts":1661387791472,"ver":"0.0.1","fwVer":"1.4.5","hwVer":"0.1.1"},"body":{"td":"GetBatteryInfo","toId":"bd802ce4-40c6-4943-b33b-58e5b06881f"}}

const botSerial = 'bd802ce4-40c6-4943-b33b-58e5b06881f0';
const deviceType = 'kw9ayx';
const resource = '6Ket';

const getJSONFormatedTopic = (command: string) =>
  `iot/p2p/${command}/x/x/x/${botSerial}/${deviceType}/${resource}/p/x/j`;

const getXMLFormatedTopic = (command: string) =>
  `iot/p2p/${command}/x/x/x/${botSerial}/${deviceType}/${resource}/q/x/x`;

const sendJSONCommand = () => {
  const topic = getJSONFormatedTopic('GetWkVer');
  const command = {};
  client.publish(topic, Buffer.from(JSON.stringify(command)), { qos: 0, retain: false }, (err) =>
    err
      ? console.log('sending err: ', err)
      : console.log(`${JSON.stringify(command)} correctly sended to [${topic}] !`),
  );
};

const sendXMLCommand = () => {
  const builder = new XMLBuilder({});
  const topic = getXMLFormatedTopic('GetBrushLifeSpan');
  const command = {};
  client.publish(topic, Buffer.from(builder.build(command)), { qos: 0, retain: false }, (err) =>
    err
      ? console.log('sending err: ', err)
      : console.log(`${JSON.stringify(command)} correctly sended to [${topic}] !`),
  );
};

const client = connect('mqtts://broker:8883', { ca });
console.info('starting mqtts listener');

client.on('connect', () => {
  console.log('connected');

  client.subscribe('iot/atr/#');

  client.subscribe(`iot/p2p/+/${botSerial}/${deviceType}/${resource}/#`, (err) => {
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
