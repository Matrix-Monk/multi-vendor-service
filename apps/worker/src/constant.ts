import * as dotenv from 'dotenv';

if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: "../../.env.development" });
}

export const MONGO_URI = process.env.MONGO_URI || '';
export const REDIS_URL = process.env.REDIS_URL || '';
export const webhookUrl = process.env.WEBHOOK_URL || '';


