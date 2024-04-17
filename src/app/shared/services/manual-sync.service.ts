import { inject, Injectable } from '@angular/core';
import { PoNotificationService } from '@po-ui/ng-components';
import { PoSyncService } from '@po-ui/ng-sync';

@Injectable({
  providedIn: 'root',
})
export class ManualSyncService {
  constructor() {}

  private notification = inject(PoNotificationService);
  private poSync = inject(PoSyncService);

  manualSync() {
    this.poSync
      .sync()
      .then(() => {
        this.notification.success({
          message: 'Sincronização concluída!',
        });
      })
      .catch(() => {
        this.notification.error({
          message:
            'Ocorreu um erro na sincronização. Tente novamente mais tarde.',
        });
      });
    return;
  }
}
