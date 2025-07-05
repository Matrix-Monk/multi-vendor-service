import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    vus: 200,
    duration : '60s'
}

export default function () {
    const BASE_URL = 'http://localhost:3000/api/v1';


    const payload = JSON.stringify({
        async: Math.random() < 0.5,
        data : 'test-data'
    })

    const headers = {
        'Content-Type': 'application/json'
    }

    const postRes = http.post(`${BASE_URL}/jobs`, payload, { headers })

    check(postRes, {
        'POST returned 201': (r) => r.status === 201,
    })

     let request_id;
        try {
            request_id = postRes.json().request_id;
        } catch (_) {
            return; // if JSON parsing fails, skip GET
        }

      sleep(0.5);

    
    const getRes = http.get(`${BASE_URL}/jobs/${request_id}`)

    check(getRes, {
    'GET returned 200 or 404': (r) => r.status === 200 || r.status === 404,
  });
}
