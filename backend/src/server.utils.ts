import fs from 'fs';

export const options = {
  key: fs.readFileSync('/opt/app/ssl.key'),
  cert: fs.readFileSync('/opt/app/ssl.crt'),
};
