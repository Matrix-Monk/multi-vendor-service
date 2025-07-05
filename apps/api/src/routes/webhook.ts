import { Router, Request, Response } from "express";
import type { Router as ExpressRouter } from "express";
import { Job } from "@repo/db/job.model";

const router: ExpressRouter = Router();

router.post("/vendor-webhook/:vendor", async (req: Request, res: Response) => {
  try {
    const { id, data } = req.body;

    if (!id) {
      res.status(400).json({ error: "Missing 'id' in request body" });
      return 
    }

    // Update the job document in MongoDB
    const result = await Job.updateOne(
      { request_id: id },
      { status: "complete", result: data }
    );

    if (result.matchedCount === 0) {
      res.status(404).json({ error: `Job with id '${id}' not found` });
      return 
    }

    res.status(200).json({ status: "ok" });
  } catch (error) {
    console.error("Error updating job:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;