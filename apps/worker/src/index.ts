import { connectMongo } from "@repo/db/mongo";
import { connectRedis, getRedis } from "@repo/db/redis";
import { processJob } from "./processor.js";
import { MONGO_URI, REDIS_URL } from "./constant.js";

const redisStream = "jobStream";

async function startWorker() {
  await connectMongo(MONGO_URI);
  await connectRedis(REDIS_URL);

  const redisClient = getRedis();

  console.log("Worker is now listening for jobs...");

    while (true) {
      
    const response = await redisClient.xRead(
      [{ key: redisStream, id: "$" }],
      { BLOCK: 0 } 
    );

    if (Array.isArray(response)) {
      for (const stream of response) {
        if (stream && typeof stream === "object" && "messages" in stream && Array.isArray((stream as any).messages)) {
          for (const message of (stream as any).messages) {
            const { request_id } = message.message;
            console.log(`Received job with ID: ${request_id}`);
            await processJob(request_id);
          }
        }
      }
    }
  }
}

startWorker().catch((err) => {
  console.error("Worker failed to start:", err);
});