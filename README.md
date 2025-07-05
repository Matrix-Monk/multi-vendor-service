#  Multi-Vendor Data Fetch Service

This project provides a unified API to fetch data from external vendors (synchronous and asynchronous), while handling rate limits transparently.

---

##  Quick Start

```bash
docker-compose up --build

##  Run test

```bash
cd k6
k6 run loadtest.js > loadtest-result.txt

  

##  architecture diagram

  +-----------+          +---------+          +--------+
  |  API      | <------> | Redis   | <------> | Worker |
  +-----------+          +---------+          +--------+
       |                                        |
       |                                        +------------------+
       |                                        | Vendor Mocks     |
       |                                        | (Sync & Async)   |
       +----------------------------------------+
                          |
                          v
                     +---------+
                     | MongoDB |
                     +---------+


Key Design Decisions
	•	Database: MongoDB is used to store job status, request payloads, and final results.
	•	Backend Language: Node.js powers both the API service and the background Worker for consistency and simplicity.
	•	Queue: Redis Streams act as a lightweight, persistent queue between the API and Worker.
	•	Two Vendor Mocks:
	    •	Sync Vendor: replies instantly to simulate synchronous vendor behavior.
	    •	Async Vendor: responds with an initial acknowledgment and later posts the final result to a webhook.
	•	Rate limit handling: Rate limits are enforced within the Worker logic to avoid exceeding vendor request limits.
	•	Job lifecycle: Each job progresses through these statuses stored in MongoDB: pending → processing → complete or failed.
	•	Load Testing:  k6 is used to stress test the system under high concurrency and measure performance.
                      



