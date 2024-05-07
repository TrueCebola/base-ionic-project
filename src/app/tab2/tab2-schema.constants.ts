import { PoSyncSchema } from '@po-ui/ng-sync';
import { environment } from 'src/environments/environment';

export const tab2Schema: PoSyncSchema = {
  getUrlApi: `${environment.apiUrl}/app/tab2`,
  diffUrlApi: `${environment.apiUrl}/app/tab2/diff`,
  deletedField: 'deleted',
  fields: ['value', 'label'],
  idField: 'id',
  name: 'tab2',
  pageSize: 1,
};
