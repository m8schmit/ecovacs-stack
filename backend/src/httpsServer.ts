import { createServer } from 'https';

import { options } from './server.utils';

const httpsServer = () => {
  const requestListener = (req: any, res: any) => {
    console.log('HTTP Server Receive: ', req, res);
    res.setHeader('Content-Type', 'text/json');
    res.writeHead(200);
    res.end(`{"message": {"success!!"}}`);
  };

  const httpServer = createServer(options, requestListener);

  const host = 'localhost';
  const port = 443;

  httpServer.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
  });

  return httpServer;
};

export default httpsServer;
