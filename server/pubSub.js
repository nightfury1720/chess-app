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
})();

function publishUpdate(channel, message) {
  pubClient.publish(channel, message, (err, reply) => {
    if (err) {
      console.error(`Failed to publish message to channel ${channel}:`, err);
    } else {
      console.log(`Message published to channel ${channel}: ${reply}`);
    }
  });
}

const subscribeToTopic = async(topic, onSubscribe) => {
  try {
    await subClient.subscribe(topic, (message, channel) => {
      console.log(`Received message on channel ${channel}: ${message}`);
      onSubscribe(message, channel);
    });
    console.log(`Subscribed to topic: ${topic}`);
  } catch (err) {
    console.error(`Failed to subscribe to topic ${topic}:`, err);
  }
}

const unsubscribeFromTopic = async (topic) => {
  try {
    await subClient.unsubscribe(topic);
    console.log(`Unsubscribed from topic: ${topic}`);
  } catch (err) {
    console.error(`Failed to unsubscribe from topic ${topic}:`, err);
  }
};


module.exports = {
  pubClient,
  subClient,
  publishUpdate,
  subscribeToTopic,
  unsubscribeFromTopic
};
