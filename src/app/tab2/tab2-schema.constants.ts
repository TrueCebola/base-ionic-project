import { PoSyncSchema } from '@po-ui/ng-sync';
import { environment } from 'src/environments/environment';

export const tab2Schema: PoSyncSchema = {
  getUrlApi: `${environment.apiUrl}/rh/tab2`,
  diffUrlApi: `${environment.apiUrl}/rh/tab2/diff`,
  deletedField: 'deleted',
  fields: ['id', 'title', 'location', 'description'],
  idField: 'id',
  name: 'tab2',
  pageSize: 1,
};
