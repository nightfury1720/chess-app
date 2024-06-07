const { createClient } = require("redis");

// Create Redis client for pub/sub
const pubSubClient = createClient({
  password: "OEOnoamGWLjfh3jyQU07Dpj0fRM4GtGM",
  socket: {
    host: "redis-14351.c305.ap-south-1-1.ec2.redns.redis-cloud.com",
    port: 14351,
  },
});

pubSubClient.on("error", (err) => console.log("Redis Pub/Sub Client Error", err));

(async () => {
  try {
    await pubSubClient.connect();
    console.log("Connected to Redis for pub/sub");
  } catch (err) {
    console.error("Failed to connect to Redis for pub/sub", err);
  }
})();

// Pub/Sub implementation
const pubClient = pubSubClient.duplicate();
const subClient = pubSubClient.duplicate();

(async () => {
  await pubClient.connect();
  await subClient.connect();

  subClient.subscribe("gameUpdates", (message, channel) => {
    console.log(`Received message on channel ${channel}: ${message}`);
    // Handle the message appropriately
  });
})();

function publishUpdate(channel, message) {
  pubClient.publish(channel, message);
}

module.exports = {
  pubClient,
  subClient,
  publishUpdate,
};
