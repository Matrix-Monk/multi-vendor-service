import express from 'express';
import { connectMongo } from '@repo/db/mongo'
import { connectRedis } from '@repo/db/redis'
import { API_BASE_URL, PORT, MONGO_URI, REDIS_URL } from './constant.js';
import jobsRouter from './routes/jobs.js'
import webhookRouter from './routes/webhook.js'
import cors from "cors";


const app = express()

app.use(express.json())

app.use(cors())


app.use(`${API_BASE_URL}/jobs`, jobsRouter);

app.use(`${API_BASE_URL}`, webhookRouter);


async function startServer() {

   console.log(MONGO_URI, REDIS_URL)

    await connectMongo(MONGO_URI);
    await connectRedis(REDIS_URL);


    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
}

startServer().catch((err) => {
  console.error("Error starting server:", err);
});
