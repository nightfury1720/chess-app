// helperServerFunctions.js

const { publishUpdate } = require("./pubSub");
const { createClient } = require("redis");

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

async function executeRedisCommand(commands) {
  try {
    const result = await cacheClient.sendCommand(commands);
    console.log(commands, "executed");
    return result;
  } catch (err) {
    console.error(`Error executing Redis command ${commands}:`, err);
    throw err;
  }
}

// Function to get unmatched players from Redis
async function getUnmatchedPlayers() {
  try {
    const players = await cacheClient.lRange("unmatchedPlayers", 0, -1);
    return players;
  } catch (err) {
    console.error("Error getting unmatched players from Redis:", err);
    throw err;
  }
}

// Function to remove a player from the unmatched players list
async function removeUnmatchedPlayer(playerId) {
  try {
    const number = await cacheClient.lRem("unmatchedPlayers", 0, playerId);
    console.log("Deleted keys:", number);
  } catch (err) {
    console.error("Error removing player from Redis:", err);
    throw err;
  }
}

// Function to set unmatched players in Redis
async function updateUnmatchedPlayers(players) {
  try {
    const multi = cacheClient.multi();
    multi.del("unmatchedPlayers");
    players.forEach((player) => {
      multi.rPush("unmatchedPlayers", player);
    });
    const [, ...replies] = await multi.exec(); // Ignore the first reply (DEL command)
    console.log("Updated unmatched players in Redis");
    console.log("Multi command replies:", replies);
  } catch (err) {
    console.error("Error updating unmatched players in Redis:", err);
    throw err;
  }
}

// Function to match players
async function matchPlayers(connections) {
  try {
    let players = await getUnmatchedPlayers();

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
        } else if (conn1 || conn2) {
          const distributedPlayer = conn1 ? player2 : player1;
          const connectedConn = conn1 ? conn1 : conn2;
          const connectedPlayer = conn1 ? player1 : player2;

          connectedConn.sendUTF(
            JSON.stringify({ type: "match", connectedPlayer, gameId })
          );

          publishUpdate(
            `startGame-${distributedPlayer}`,
            JSON.stringify({ gameId, opponentId: connectedPlayer })
          );
        } else {
          publishUpdate(
            `startGame-${player1}`,
            JSON.stringify({ gameId, opponentId: player2 })
          );
          publishUpdate(
            `startGame-${player2}`,
            JSON.stringify({ gameId, opponentId: player1 })
          );
        }
      }

      console.log(`Matched players: ${player1} and ${player2}`);
    }

    await updateUnmatchedPlayers(players);
  } catch (err) {
    console.error("Error in matchPlayers:", err);
    throw err;
  }
}

function originIsAllowed(origin) {
  // TODO: Put logic here to detect whether the specified origin is allowed.
  return true;
}

module.exports = {
  executeRedisCommand,
  originIsAllowed,
  matchPlayers,
  removeUnmatchedPlayer,
  getUnmatchedPlayers,
  updateUnmatchedPlayers,
};
