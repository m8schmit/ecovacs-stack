import { IncomingMessage, ServerResponse } from 'http';
import { createServer } from 'https';

import { options } from './server.utils';

const httpsServer = () => {
  const requestListener = (req: IncomingMessage, res: ServerResponse) => {
    console.log(' \x1b[34mHTTP Server Receive: ', `[${req.method}]`, req.url, req.headers, ` \x1b[0m`);
    let body = '';
    req.on('data', (chunk: Buffer) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      console.log(body);
      res.end('ok');
    });
  };

  const httpServer = createServer(options, requestListener);

  const port = 443;

  httpServer.listen(port, () => {
    console.log(`HTTPS Server is running`);
  });

  return httpServer;
};

export default httpsServer;
