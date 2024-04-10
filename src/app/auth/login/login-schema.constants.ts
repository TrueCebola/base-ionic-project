import { PoSyncSchema } from '@po-ui/ng-sync';

export const loginSchema: PoSyncSchema = {
  getUrlApi: 'https://po-sample-login.onrender.com/logins',
  diffUrlApi: 'https://po-sample-login.onrender.com/logins/diff',
  deletedField: 'deleted',
  fields: ['id', 'title', 'location', 'description'],
  idField: 'id',
  name: 'login',
  pageSize: 1,
};
