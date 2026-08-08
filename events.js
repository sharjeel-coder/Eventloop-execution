const EventEmitter = require("events");
const http = require("http");
//if we want to use this logic in the realworld then we have to do in this way
class myEmitter extends EventEmitter {
  constructor() {
    super(); //will inherit all method of the myEmitter
  }
}
const sales = new myEmitter();

sales.on("request", () => {
  console.log("emitter 1");
});

sales.on("request", () => {
  console.log("this is emitter 2");
});

sales.on("request", (stock) => {
  console.log(`${stock} in stock`);
});

//we can also pass an argument with the emitter and the respective emitter will use it

sales.emit("request", 7);
// http module also uses the emitter class internally
const server = http.createServer();
server.on("request", (req, res) => {
  console.log("request recieved");
});

server.on("request", (req, res) => {
  console.log("request 2 recieved");
  res.end("request 2 recieved");
});

server.listen(8000, "127.0.0.1", () => {
  console.log("server is listenig at port 8000");
});
