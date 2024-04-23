import { PoSyncSchema } from '@po-ui/ng-sync';
import { environment } from 'src/environments/environment';

export const tab2ComboSchema: PoSyncSchema = {
  getUrlApi: `${environment.apiUrl}/rh/tab2/combo`,
  diffUrlApi: `${environment.apiUrl}/rh/tab2/combo/diff`,
  deletedField: 'deleted',
  fields: ['id', 'title', 'location', 'description'],
  idField: 'id',
  name: 'tab2',
  pageSize: 1,
};
