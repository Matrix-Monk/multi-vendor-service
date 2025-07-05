import { Router } from "express";
import type { Router as ExpressRouter } from "express";
import { v4 as uuidv4 } from "uuid";
import { Job } from "@repo/db/job.model";
import { getRedis} from '@repo/db/redis'



const router: ExpressRouter = Router();




router.post('/', async (req, res) => {
    const redisClient = getRedis();
  
    const request_id = uuidv4(); 
    const payload = req.body;

    const vendor = payload.async ? "async" : "sync" ;

    const job = new Job({
      request_id,
      payload,
      status: "pending",
      vendor,
    });
  
    console.log(job)

    await job.save();

    await redisClient.xAdd("jobStream" , "*", { request_id });

    res.status(201).json({ request_id: request_id });
})



router.get('/:id', async (req, res) =>{
    const jobId = req.params.id;

    const job = await Job.findOne({ request_id: jobId });
    if (!job) {
        res.status(404).send("Not found")
        return
    };
    

    res
      .status(200)
      .json({ message: `Details for job ${jobId}`, status: job.status });
})


export default router