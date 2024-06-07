const WebSocketServer = require("websocket").server;
const http = require("http");
const { createClient } = require("redis");
const { pubClient, subClient, publishUpdate } = require("./pubSub");

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

// Function to get unmatched players from Redis
async function getUnmatchedPlayers() {
  return new Promise((resolve, reject) => {
    cacheClient.lrange("unmatchedPlayers", 0, -1, (err, players) => {
      if (err) {
        console.error("Error getting unmatched players from Redis:", err);
        reject(err);
      } else {
        resolve(players);
      }
    });
  });
}

// Function to set unmatched players in Redis
async function updateUnmatchedPlayers(players) {
  return new Promise((resolve, reject) => {
    cacheClient.del("unmatchedPlayers", (err) => {
      if (err) {
        console.error("Error deleting unmatched players from Redis:", err);
        reject(err);
      } else {
        cacheClient.rpush("unmatchedPlayers", ...players, (err) => {
          if (err) {
            console.error("Error pushing unmatched players to Redis:", err);
            reject(err);
          } else {
            resolve();
          }
        });
      }
    });
  });
}

// Function to match players
async function matchPlayers() {
  try {
    const players = await getUnmatchedPlayers();
    while (players.length >= 2) {
      const player1 = players.shift();
      const player2 = players.shift();

      if (player1 && player2) {
        const conn1 = connections.get(player1);
        const conn2 = connections.get(player2);
        const gameId = `game-${player1}-${player2}`;
        const gameState = {
          player1,
          player2,
          moves: [],
        };

        await cacheClient.set(gameId, JSON.stringify(gameState));

        if (conn1 && conn2) {
          conn1.sendUTF(
            JSON.stringify({ type: "match", opponent: player2, gameId })
          );
          conn2.sendUTF(
            JSON.stringify({ type: "match", opponent: player1, gameId })
          );
          console.log(`Matched players: ${player1} and ${player2}`);
        } else if (conn1 || conn2) {
          const distributedPlayer = conn1 ? player2 : player1;
          const connectedConn = conn1 ? conn1 : conn2;
          const connectedPlayer = conn1 ? player1 : player2;

          connectedConn.sendUTF(
            JSON.stringify({ type: "match", connectedPlayer, gameId })
          );

          publishUpdate(
            "start-match",
            JSON.stringify({ players: [distributedPlayer], gameId })
          );
        } else {
          publishUpdate(
            "start-match",
            JSON.stringify({ players: [player1, player2], gameId })
          );
        }
      }
    }
    await updateUnmatchedPlayers(players);
  } catch (err) {
    console.error("Error in matchPlayers:", err);
  }
}

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

function originIsAllowed(origin) {
  // TODO: Put logic here to detect whether the specified origin is allowed.
  return true;
}

// Store client connections
const connections = new Map();

// WebSocket request handling
wsServer.on("request", async (request) => {
  if (!originIsAllowed(request.origin)) {
    request.reject();
    console.log(`${new Date()} Connection from origin ${request.origin} rejected.`);
    return;
  }

  const connection = request.accept(null, request.origin);
  const clientId = connection.remoteAddress;
  connections.set(clientId, connection);
  console.log(`${new Date()} Connection accepted. Client ID: ${clientId}`);

  connection.on("message", async (message) => {
    if (message.type === "utf8") {
      console.log(`Received Message from ${clientId}: ${message.utf8Data}`);
      const msg = JSON.parse(message.utf8Data);

      if (msg.type === "move") {
        try {
          const gameState = JSON.parse(await cacheClient.get(msg.gameId));
          gameState.moves.push(msg.move);

          await cacheClient.set(msg.gameId, JSON.stringify(gameState));
          await broadcastMessageToOpponent(msg.gameId, clientId, msg);
        } catch (err) {
          console.error(`Failed to process move for ${clientId}:`, err);
        }
      } else if (msg.type === "initiateGame") {
        cacheClient.rpush("unmatchedPlayers", clientId, (err) => {
          if (err) {
            console.error(`Failed to add ${clientId} to unmatched players:`, err);
          } else {
            console.log(`Added an unmatched player: ${clientId}`);
            matchPlayers(); // Ensure this is only called after rpush is successful
          }
        });
      }
    } else if (message.type === "binary") {
      console.log(`Received Binary Message of ${message.binaryData.length} bytes from ${clientId}`);
    }
  });

  connection.on("close", (reasonCode, description) => {
    connections.delete(clientId);
    console.log(`${new Date()} Peer ${connection.remoteAddress} (Client ID: ${clientId}) disconnected.`);
  });
});

function broadcastMessageToOpponent(gameId, senderId, message) {
  cacheClient.get(gameId, (err, reply) => {
    if (err) {
      console.error("Error fetching game state from Redis:", err);
      return;
    }

    const gameState = JSON.parse(reply);
    const opponentId = gameState.player1 === senderId ? gameState.player2 : gameState.player1;
    const opponentConn = connections.get(opponentId);

    if (opponentConn) {
      opponentConn.sendUTF(message);
    } else {
      pubClient.publish(gameId, JSON.stringify({ type: "move", gameId, message }));
    }
  });
}
