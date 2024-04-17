import { PoSyncSchema } from '@po-ui/ng-sync';
import { environment } from 'src/environments/environment';

export const tab1Schema: PoSyncSchema = {
  getUrlApi: `${environment.apiUrl}/rh/tab1`,
  diffUrlApi: `${environment.apiUrl}/rh/tab1/diff`,
  deletedField: 'deleted',
  fields: ['id', 'title', 'location', 'description'],
  idField: 'id',
  name: 'tab1',
  pageSize: 1,
};
