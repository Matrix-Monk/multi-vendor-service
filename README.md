#  Multi-Vendor Data Fetch Service

This project provides a unified API to fetch data from external vendors (synchronous and asynchronous), while handling rate limits transparently.

---

##  Quick Start

```bash
docker-compose up --build
```

##  Run test

```bash
cd k6 && k6 run loadtest.js > loadtest-result.txt
```

## Monitor logs

1. api logs
```bash
docker-compose logs -f api
```
2. Worker logs
```bash
docker-compose logs -f worker
```
3. K6 result logs
```bash
check loadtest-result.txt inside multi-vendor-service/K6
```

##  architecture diagram

```bash
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
```

## Key Design Decisions
	•	Database: MongoDB is used to store job status, request payloads, and final results.
	•	Backend Language: Node.js powers both the API service and the background Worker for consistency and simplicity.
	•	Queue: Redis Streams act as a lightweight, persistent queue between the API and Worker.
	•	Two Vendor Mocks:
	    •	Sync Vendor: replies instantly to simulate synchronous vendor behavior.
	    •	Async Vendor: responds with an initial acknowledgment and later posts the final result to a webhook.
	•	Rate limit handling: Rate limits are enforced within the Worker logic to avoid exceeding vendor request limits.
	•	Job lifecycle: Each job progresses through these statuses stored in MongoDB: pending → processing → complete or failed.
	•	Load Testing:  k6 is used to stress test the system under high concurrency and measure performance.
                      

## cURL Commands

1. Post endpoint to create a job : returns a request_id

    ```bash
    curl -X POST http://localhost:3000/api/v1/jobs \
        -H "Content-Type: application/json" \
        -d '{"vendor":"sync","payload":"some test data"}'
    ```

2. Get endpoint to fetch the status of the job: Insert the request_id

    ```bash
    curl http://localhost:3000/api/v1/jobs/<request_id>
    ```

## Short analysis  

1.  The API handled ~16,924 iterations without errors.
2.  Average response time was ~109ms, with 95% of requests completing under ~486ms.
3.  The worker’s rate limiters behaved correctly:
4.  Async jobs limited to 1 per second.
5.  Sync jobs limited to ~3 per second.
6.  No adjustments were needed during the test.