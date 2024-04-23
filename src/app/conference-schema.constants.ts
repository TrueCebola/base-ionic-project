import { PoSyncSchema } from '@po-ui/ng-sync';

export const conferenceSchema: PoSyncSchema = {
  // Endpoint para o método GET
  getUrlApi: 'https://po-sample-conference.onrender.com/conferences',
  diffUrlApi: 'https://po-sample-conference.onrender.com/conferences/diff',
  deletedField: 'isDeleted',
  fields: ['id', 'title', 'date', 'location', 'description'],
  idField: 'id',
  name: 'conference',
  pageSize: 1,
};
