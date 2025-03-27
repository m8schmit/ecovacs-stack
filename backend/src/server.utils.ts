import fs from 'fs';
import { IncomingMessage, ServerResponse } from 'http';
import { inspect } from 'util';

export const options = {
  key: fs.readFileSync('/opt/app/ssl.key'),
  cert: fs.readFileSync('/opt/app/ssl.crt'),
//~ for some reason Node needs to have root certificate authority to trust mkcert-generated certificates
  ca: fs.readFileSync('/opt/app/rootCA.pem'),
};

export const requestListener = (req: IncomingMessage, res: ServerResponse) => {
  const { headers, method, url } = req;
  console.log(`\x1b[34mHTTPS Server Receive: \x1b[0m`, inspect({ method, url, headers }, false, null, true));
  let body = '';
  req.on('data', (chunk: Buffer) => {
    body += chunk.toString();
  });
  req.on('end', () => {
    let statusCode = 200;
    try {
      body = JSON.parse(body);
    } catch {}
    console.log(`\x1b[34mHTTPS BODY: \x1b[0m [`, body, `]`);
    //temporary to prevent a firmware download success then a bot crash when the bot call "https://portal.ecouser.net/api/ota/products/wukong/class/{ressources}/firmware/latest.json?"
    if (url && url.search('wukong') >= 0) {
      statusCode = 404;
    }
    res.writeHead(statusCode);
    res.end();
  });
};
