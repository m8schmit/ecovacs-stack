import { createServer } from 'https';
import fs from 'fs';

const options = {
  key: fs.readFileSync('/opt/app/src/server.key'),
  cert: fs.readFileSync('/opt/app/src/server.crt'),
};

const requestListener = (req: any, res: any) => {
  console.log(req, res);
  res.setHeader('Content-Type', 'text/json');
  res.writeHead(200);
  res.end(`{"message": {"success!!"}}`);
};

const httpServer = createServer(options, requestListener);

const host = '0.0.0.0';
const port = 8443;

httpServer.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});
