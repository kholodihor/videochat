import next from "next";
import { createServer } from "node:http";

import { createSocketServer } from "./socket.js";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = process.env.PORT || 3000;

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

const httpServer = createServer(handler);
const io = createSocketServer(httpServer);
export { io };

app.prepare().then(() => {
  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
