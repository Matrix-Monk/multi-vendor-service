import { Job } from "@repo/db/job.model";
import axios from "axios";
import { webhookUrl } from "./constant.js";
import Bottleneck from "bottleneck";

const MAX_RETRIES = 3;

// Create a Bottleneck limiter per vendor
const limiters = {
  async: new Bottleneck({
    minTime: 1000, 
    maxConcurrent: 1,
  }),
  sync: new Bottleneck({
    minTime: 300, 
    maxConcurrent: 1,
  }),
};

export async function processJob(requestId: string) {
  const job = await Job.findOne({ request_id: requestId });

  if (!job) {
    console.warn(`Job with ID ${requestId} not found`);
    return;
  }

  const { vendor } = job;

  if (!limiters[vendor]) {
    console.error(`No limiter configured for vendor: ${vendor}`);
    return;
  }

  console.log(`Processing job ${requestId} (vendor=${vendor})...`);

  // Mark as processing
  await Job.updateOne({ request_id: requestId }, { status: "processing" });

  let retries = job.retries || 0;

  // Wrap the whole job processing logic in the limiter
  await limiters[vendor].schedule(async () => {
    while (retries < MAX_RETRIES) {
      try {
        // Simulate processing work
        await new Promise((resolve) => setTimeout(resolve, 2000));

        if (vendor === "async") {
          console.log(`Calling webhook for job ${requestId}...`);
          const response = await axios.post(`${webhookUrl}/${vendor}`, {
            id: job.request_id,
            data: { message: "Processed successfully by worker" },
          });

          if (response.status === 200) {
            console.log(`Webhook succeeded for job ${requestId}. Marking complete.`);
            await Job.updateOne(
              { request_id: requestId },
              { status: "complete" }
            );
            return;
          } else {
            throw new Error(`Webhook returned status ${response.status}`);
          }
        } else if (vendor === "sync") {
          await Job.updateOne(
            { request_id: requestId },
            {
              status: "complete",
              result: { message: "Sync job completed." },
            }
          );
          console.log(`Sync job ${requestId} marked complete.`);
          return;
        }
      } catch (err: any) {
        retries += 1;
        console.error(`Error processing job ${requestId} (attempt ${retries}):`, err.message);

        if (retries >= MAX_RETRIES) {
          console.error(`Job ${requestId} reached max retries. Marking as failed.`);
          await Job.updateOne(
            { request_id: requestId },
            {
              status: "failed",
              result: { error: err.message || "Unknown error" },
              retries,
            }
          );
          return;
        }

        // Save updated retries count
        await Job.updateOne(
          { request_id: requestId },
          { retries }
        );

        console.log(`Retrying job ${requestId}...`);
      }
    }
  });
}