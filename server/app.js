const WebSocketServer = require("websocket").server;
const http = require("http");
const { createClient } = require("redis");
const { v4: uuidv4 } = require("uuid");
const {
  unsubscribeFromTopic,
  subscribeToTopic,
  publishUpdate,
} = require("./pubSub");
const {
  matchPlayers,
  removeUnmatchedPlayer,
  originIsAllowed,
} = require("./helperServerFunctions");

// Create Redis client for persistence
const cacheClient = createClient({
  password: "OEOnoamGWLjfh3jyQU07Dpj0fRM4GtGM",
  socket: {
    host: "redis-14351.c305.ap-south-1-1.ec2.redns.redis-cloud.com",
    port: 14351,
  },
});

cacheClient.on("error", (err) => console.log("Redis Client Error", err));

(async () => {
  try {
    await cacheClient.connect();
    console.log("Connected to Redis for caching");
  } catch (err) {
    console.error("Failed to connect to Redis for caching", err);
  }
})();

// Create HTTP server
const server = http.createServer((request, response) => {
  console.log(`${new Date()} Received request for ${request.url}`);
  response.writeHead(404);
  response.end();
});

server.listen(8080, () => {
  console.log(`${new Date()} Server is listening on port 8080`);
});

// Create WebSocket server
const wsServer = new WebSocketServer({
  httpServer: server,
  autoAcceptConnections: false,
});

// Store client connections
const connections = new Map();

// WebSocket request handling
wsServer.on("request", async (request) => {
  if (!originIsAllowed(request.origin)) {
    request.reject();
    console.log(
      `${new Date()} Connection from origin ${request.origin} rejected.`
    );
    return;
  }

  const connection = request.accept(null, request.origin);
  const clientId = uuidv4();
  connections.set(clientId, connection);
  console.log(`${new Date()} Connection accepted. Client ID: ${clientId}`);

  // Subscribe to the playedMove topic for this client
  const playedMoveTopic = `playedMove-${clientId}`;
  const startGameTopic = `startGame-${clientId}`;

  const onSubscribeHandler = (message, channel) => {
    const msg = JSON.parse(message);
    const type = channel.split("-")[0];
    const clientConn = connections.get(clientId);
    if (clientConn) {
      clientConn.sendUTF(
        JSON.stringify({
          ...msg,
          type,
        })
      );
    }
  };
  subscribeToTopic(startGameTopic, onSubscribeHandler);
  subscribeToTopic(playedMoveTopic, onSubscribeHandler);

  connection.on("message", async (message) => {
    if (message.type === "utf8") {
      console.log(`Received Message from ${clientId}: ${message.utf8Data}`);
      const msg = JSON.parse(message.utf8Data);

      if (msg.type === "playedMove") {
        try {
          const opponentId = msg.opponentId;
          let gameState = JSON.parse(await cacheClient.get(msg.gameId));
          gameState.moves.push(msg.move);
          await cacheClient.set(msg.gameId, JSON.stringify(gameState));
          const opponentConn = connections.get(opponentId);
          if (opponentConn) {
            opponentConn.sendUTF(message);
          } else {
            publishUpdate(
              `playedMove-${opponentId}`,
              JSON.stringify({
                gameId: msg.gameId,
                move: msg.move,
              })
            );
          }
        } catch (err) {
          console.error(`Failed to process move for ${clientId}:`, err);
        }
      } else if (msg.type === "startGame") {
        cacheClient.rPush("unmatchedPlayers", clientId, (err) => {
          if (err) {
            console.error(
              `Failed to add ${clientId} to unmatched players:`,
              err
            );
          } else {
            console.log(`Added an unmatched player: ${clientId}`);
            matchPlayers(); // Ensure this is only called after rpush is successful
          }
        });
      } else{
        console.log("Wrong type, pls check message Type")
      }
    }
  });

  connection.on("close", async (reasonCode, description) => {
    try {
      connections.delete(clientId);
      console.log(
        `${new Date()} Peer ${
          connection.remoteAddress
        } (Client ID: ${clientId}) disconnected. ReasonCode: ${reasonCode}, description: ${description}`
      );

      // Unsubscribe from the topic
      await unsubscribeFromTopic(playedMoveTopic);
      await unsubscribeFromTopic(startGameTopic);
      await removeUnmatchedPlayer(cacheClient, clientId);
    } catch (err) {
      console.error(
        `Error during disconnection cleanup for Client ID: ${clientId}`,
        err
      );
    }
  });
});
