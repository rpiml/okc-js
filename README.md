# okc-js

Javascript utilities and bindings for [OkCollege](https://github.com/rpiml/okcollege-dev) services.

## Installation

`npm install --save @seveibar/okc-js`

or

`yarn add @seveibar/okc-js`

## Usage: Redis

### Example

```javascript

import { redis } from '@seveibar/okc-js';

// Setting keys
redis.set('model:weights', '0,1,2,...');

// Getting keys
let weights = redis.get('model:weights');

// You can also directly ask for the redis client
// *Note Don't forget to quit the client!
// This is the redis object from node_redis
let client = redis.getClient();

client.get("somekey", function (err, reply) {
    console.log(reply.toString());
});

// and when we're done...
client.quit();

```

## Usage: Postgres

### Example

```javascript

import { psql } from '@seveibar/okc-js';

async function main(){
  const db = await psql.connect();
  await db.clearSurveyDB(); // clear all surveys
  await db.insertSurvey({
    uuid: "survey_id1",
    content: { ... } // form.json filled out
  }); // insert a new survey
  await db.insertSurvey({ uuid: "survey_id2", ... });
  const surveys = await db.getSurveys(); // get all surveys from db
  console.log(surveys);
  /**
   * [{
   *  uuid: "survey_id1",
   *  content: { ... },
   *  updatedAt: Date
   * },
   * {
   *  uuid: "survey_id2",
   *  content: { ... },
   *  updatedAt: Date
   * }]
   */
}

```

## Usage: Rabbitmq

### csvpredict(surveycsv: string): Promise<string>

Calls into predictor service to get a prediction on a CSV.

```javascript

import fs from 'fs';
import { rmq } from '@seveibar/okc-js';

rmq.csvpredict(fs.readFileSync('completed_survey.csv').toString()).then(result => {
  console.log(result);
  /*
   * college_id, score
   * harvard, 0.5
   * rpi, 0.4
   */
});

```

### fullpredict(survey: Object): Promise<Object>

Calls into prediction preprocessing services to provide prediction with results
in JSON.

```javascript

import { rmq } from '@seveibar/okc-js';

rmq.fullpredict(filledUserSurvey).then(result => {
  console.log(result);
  /*
   * colleges: [
   *   { 'id' : 'harvard', 'score': 0.5 },
   *   { 'id' : 'rpi', 'score': 0.4 }
   * ]
   */
});
```

### rpc(queue:string, message:string): Promise<string>

Remote procedure call on Rabbitmq

```javascript

import { rmq } from '@seveibar/okc-js';

const msg = JSON.stringify({a: 'message'});
rmq('some_queue', msg).then((rawRes) => {
  const res = JSON.parse(rawRes);
  // do something with response
});

```

### rpcReply(queue:string, reply: : (x: string) => Promise<string>)

Respond to remote procedure calls using rabbitmq.

```javascript

import { rmq } from '@seveibar/okc-js';

rmq.rpcReply('some_queue', async (msg) => {
  let computation = await computeMessage(msg);
  return computation;
})

```
