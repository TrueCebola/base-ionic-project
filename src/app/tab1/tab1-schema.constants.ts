import { PoSyncSchema } from '@po-ui/ng-sync';
import { environment } from 'src/environments/environment';

export const tab1Schema: PoSyncSchema = {
  getUrlApi: `${environment.apiUrl}/app/tab1`,
  diffUrlApi: `${environment.apiUrl}/app/tab1/diff`,
  deletedField: 'deleted',
  fields: ['value', 'label'],
  idField: 'id',
  name: 'tab1',
  pageSize: 1,
};
