import { createServer, IncomingMessage, ServerResponse } from 'http';

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

  const httpServer = createServer(requestListener);

  const port = 8080;

  httpServer.listen(port, () => {
    console.log(`HTTP Server is running`);
  });

  return httpServer;
};

export default httpsServer;
