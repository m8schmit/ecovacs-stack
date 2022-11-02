import { createServer } from 'http';

import { requestListener } from './server.utils';

const httpServer = () => {
  const httpServer = createServer(requestListener);
  const port = 8080;

  httpServer.listen(port, () => {
    console.log(`HTTP Server is running`);
  });

  return httpServer;
};

export default httpServer;
