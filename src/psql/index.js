// @flow

import pg from 'pg-promise';
import uuid from 'node-uuid';
import config from '../config';

declare class $dbConfig {
  host: string,
  database: string,
  user: string,
  password: string
}

const getUUID = () => uuid.v4();

export class OKCSQLConnection {
  db: any

  constructor(dbConfig: $dbConfig) {
    this.db = pg()(dbConfig);
  }

  async getSurveys() {
    const surveys = await this.db.any('select * from survey_response', [
      'uuid', 'content', 'updatedAt',
    ]);
    return surveys.map((survey) => ({
      uuid: survey.uuid,
      content: survey.content,
      updatedAt: survey.updatedAt,
    }));
  }

  async insertSurvey(survey: {uuid: ?string, content: Object}) {
    if (!survey.uuid) {
      survey.uuid = getUUID();
    }
    survey.createdAt = new Date();
    survey.updatedAt = new Date();
    await this.db.none('insert into survey_response(uuid, content, \"createdAt\", \"updatedAt\") values(${uuid},${content}, ${createdAt}, ${updatedAt})', survey);
  }

  async clearSurveyDB(){
    await this.db.none('delete from survey_response');
  }


}

export async function connect() {
  return new OKCSQLConnection({
    host: config.database.host,
    database: config.database.name,
    user: 'postgres',
    password: '',
  });
}
