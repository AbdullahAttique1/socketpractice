import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);
  const io = new Server(httpServer);

  io.on('connection', (socket) => {
    console.log('A user connected');
    
    // Emit 'hello' to the client
    io.emit('hello', 'world');
    
    // Broadcast a 'hi' to everyone except the sender
    socket.broadcast.emit('hi');

    // Handle 'chat message' event from the client
    socket.on('chat message', (msg) => {
      console.log('Received message:', msg);
      io.emit('chat message', msg);
    });
  });

  httpServer
    .once('error', (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
