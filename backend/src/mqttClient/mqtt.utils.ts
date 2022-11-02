import { inspect } from 'node:util';

export const getColoredConsoleLog = (topic: string) => {
  let color = 32;
  if (topic.includes('p2p')) {
    if (topic.includes('/p/')) {
      color = 36;
    } else {
      color = 35;
    }
  }
  return `\x1b[${color}m[${topic}]\x1b[0m`;
};

export const isTopic = (query: string, topic: string) =>
  topic.search('/q/') < 0 && topic.search(query) >= 0 && process.env.BOTID && topic.search(process.env.BOTID) >= 0;

export const getDatafromMessage = (message: Buffer) => JSON.parse(message.toString()).body.data;

export const getLogs = (topic: string, message: Buffer) => {
  let formattedRes = JSON.parse(message.toString());
  if (isTopic('onFwBuryPoint', topic)) {
    formattedRes.body.data.content = JSON.parse(formattedRes.body.data.content);
  }
  console.log(`${new Date().toUTCString()}`, getColoredConsoleLog(topic), inspect(formattedRes, true, null, true));
};
