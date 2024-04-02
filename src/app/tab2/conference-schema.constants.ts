import { PoSyncSchema } from '@po-ui/ng-sync';

export const conferenceSchema: PoSyncSchema = {
  getUrlApi: 'https://po-sample-conference.onrender.com/conferences',
  diffUrlApi: 'https://po-sample-conference.onrender.com/conferences/diff',
  deletedField: 'deleted',
  fields: ['id', 'title', 'location', 'description'],
  idField: 'id',
  name: 'conference',
  pageSize: 1,
};
