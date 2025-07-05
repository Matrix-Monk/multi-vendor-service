import * as dotenv from 'dotenv';

if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: "../../.env.development" });
}

export const API_VERSION = 'v1';
export const API_BASE_URL = `/api/${API_VERSION}`;
export const MONGO_URI = process.env.MONGO_URI || '';
export const REDIS_URL = process.env.REDIS_URL || '';
export const PORT = process.env.PORT || 3001;

