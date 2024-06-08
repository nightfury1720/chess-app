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
    await updateUnmatchedPlayers(cacheClient, players);
  } catch (err) {
    console.error("Error in matchPlayers:", err);
  }
}

const broadcastMessageToOpponent = async (cacheClient, connections, gameId, senderId, message) => {
  cacheClient.get(gameId, (err, reply) => {
    if (err) {
      console.error("Error fetching game state from Redis:", err);
      return;
    }

    const gameState = JSON.parse(reply);
    const opponentId =
      gameState.player1 === senderId ? gameState.player2 : gameState.player1;
    const opponentConn = connections.get(opponentId);

    if (opponentConn) {
      opponentConn.sendUTF(message);
    } else {
      pubClient.publish(
        gameId,
        JSON.stringify({ type: "move", gameId, message })
      );
    }
  });
};

function originIsAllowed(origin) {
  // TODO: Put logic here to detect whether the specified origin is allowed.
  return true;
}

module.exports = {
  originIsAllowed,
  matchPlayers,
  removeUnmatchedPlayer,
  broadcastMessageToOpponent,
  getUnmatchedPlayers,
  updateUnmatchedPlayers,
};
