// helperServerFunctions.js

const { pubClient, subClient, publishUpdate } = require("./pubSub");

// Function to get unmatched players from Redis
async function getUnmatchedPlayers(cacheClient) {
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

// Function to remove a player from the unmatched players list
async function removeUnmatchedPlayer(cacheClient, playerId) {
  cacheClient.lrem("unmatchedPlayers", 0, playerId, (err, reply) => {
    if (err) {
      console.error("Error removing element from list:", err);
    } else {
      console.log(`Number of elements removed: ${reply}`);
    }
  });
}
// Function to set unmatched players in Redis
async function updateUnmatchedPlayers(cacheClient, players) {
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
async function matchPlayers(cacheClient, connections) {
  try {
    const players = await getUnmatchedPlayers(cacheClient);
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
    }
    await updateUnmatchedPlayers(cacheClient, players);
  } catch (err) {
    console.error("Error in matchPlayers:", err);
  }
}

function originIsAllowed(origin) {
  // TODO: Put logic here to detect whether the specified origin is allowed.
  return true;
}

module.exports = {
  originIsAllowed,
  matchPlayers,
  removeUnmatchedPlayer,
  getUnmatchedPlayers,
  updateUnmatchedPlayers,
};
