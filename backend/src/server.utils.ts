import fs from 'fs';

export const options = {
  key: fs.readFileSync('/opt/app/server.key'),
  cert: fs.readFileSync('/opt/app/server.crt'),
};

export const ca = fs.readFileSync('/opt/app/ca.crt');
