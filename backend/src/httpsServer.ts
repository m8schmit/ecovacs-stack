import { createServer } from 'https';

import { options, requestListener } from './server.utils';

const httpsServer = () => {
  const httpServer = createServer(options, requestListener);
  const port = 443;

  httpServer.listen(port, () => {
    console.log(`HTTPS Server is running`);
  });

  return httpServer;
};

export default httpsServer;
