import { PoSyncSchema } from '@po-ui/ng-sync';
import { environment } from 'src/environments/environment';

export const tab2ComboSchema: PoSyncSchema = {
  getUrlApi: `${environment.apiUrl}/app/tab2/combo`,
  diffUrlApi: `${environment.apiUrl}/app/tab2/combo/diff`,
  deletedField: 'deleted',
  fields: ['value', 'label'],
  idField: 'id',
  name: 'tab2',
  pageSize: 1,
};
