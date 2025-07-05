import { createClient } from "redis";

let redisClient: ReturnType<typeof createClient>;

export async function connectRedis(url: string) {
  redisClient = createClient({ url });
  await redisClient.connect();
  console.log("Connected to Redis");
}

export function getRedis(): ReturnType<typeof createClient> {
  if (!redisClient) throw new Error("Redis not initialized");
  return redisClient;
}