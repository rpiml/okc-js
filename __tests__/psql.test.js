// @flow

import { connect } from '../src/psql';

describe('psql tests', () =>{

  it('should be able to insert and read surveys', async () => {
    const db = await connect();
    await db.clearSurveyDB();
    await db.insertSurvey({
      content: {
        firstPage: "start",
        pages: [
          {
            id: "start"
          }
        ]
      }
    });
    const surveys = await db.getSurveys();
    expect(surveys.length).toBe(1);
  });
  
});
