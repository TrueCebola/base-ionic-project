import { PoSyncSchema } from '@po-ui/ng-sync';
import { environment } from 'src/environments/environment';

export const loginSchema: PoSyncSchema = {
  getUrlApi: `${environment.apiUrl}/auth/users`,
  diffUrlApi: `${environment.apiUrl}/auth/users/diff`,
  deletedField: 'deleted',
  fields: ['id', 'title', 'location', 'description'],
  idField: 'id',
  name: 'login',
  pageSize: 1,
};
