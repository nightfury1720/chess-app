const WebSocketServer = require("websocket").server;
const http = require("http");
const { createClient } = require("redis");

// Create Redis client
const client = createClient({
  password: "OEOnoamGWLjfh3jyQU07Dpj0fRM4GtGM",
  socket: {
    host: "redis-14351.c305.ap-south-1-1.ec2.redns.redis-cloud.com",
    port: 14351,
  },
});

client.on('error', (err) => console.log('Redis Client Error', err));

(async () => {
  try {
    await client.connect();
    console.log('Connected to Redis');
  } catch (err) {
    console.error('Failed to connect to Redis', err);
  }
})();

// Create HTTP server
const server = http.createServer((request, response) => {
  console.log(`${new Date()} Received request for ${request.url}`);
  response.writeHead(404);
  response.end();
});

// Start HTTP server
server.listen(8080, () => {
  console.log(`${new Date()} Server is listening on port 8080`);
});

// Create WebSocket server
const wsServer = new WebSocketServer({
  httpServer: server,
  autoAcceptConnections: false,
});

// Function to check if origin is allowed
function originIsAllowed(origin) {
  // Put logic here to detect whether the specified origin is allowed.
  return true;
}

// Handle WebSocket requests
wsServer.on("request", (request) => {
  if (!originIsAllowed(request.origin)) {
    request.reject();
    console.log(`${new Date()} Connection from origin ${request.origin} rejected.`);
    return;
  }

  const connection = request.accept(null, request.origin);
  console.log(`${new Date()} Connection accepted.`);

  connection.on("message", (message) => {
    if (message.type === "utf8") {
      console.log(`Received Message: ${message.utf8Data}`);
      // Handle UTF-8 message
    } else if (message.type === "binary") {
      console.log(`Received Binary Message of ${message.binaryData.length} bytes`);
      // Handle binary message
      // connection.sendBytes(message.binaryData); // Uncomment if you want to echo back the binary data
    }
  });

  connection.on("close", (reasonCode, description) => {
    console.log(`${new Date()} Peer ${connection.remoteAddress} disconnected.`);
  });
});
