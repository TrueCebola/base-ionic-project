import { Component, inject } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { Capacitor } from '@capacitor/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar } from '@capacitor/status-bar';
import {
  PoNetworkService,
  PoNetworkType,
  PoSyncConfig,
  PoSyncModule,
  PoSyncService,
} from '@po-ui/ng-sync';
import { conferenceSchema } from './tab2/conference-schema.constants';
import { StorageService } from './auth/services/storage.service';
import { PoModule, PoNotificationService } from '@po-ui/ng-components';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet, PoModule, PoSyncModule],
})
export class AppComponent {
  constructor(private platform: Platform, private poSync: PoSyncService) {
    this.initializeApp();
  }

  private storageService = inject(StorageService);
  private notification = inject(PoNotificationService);
  private network = inject(PoNetworkService);

  async initializeApp() {
    await this.platform.ready();
    if (Capacitor.isNativePlatform()) {
      StatusBar.setOverlaysWebView({ overlay: true });
    }
    await SplashScreen.hide();

    this.initSync();
  }

  initSync() {
    const config: PoSyncConfig = {
      type: PoNetworkType.wifi,
    };
    const schemas = [conferenceSchema];
    const newInstallation = this.storageService.isNewInstall();
    const networkStatus = this.network.getConnectionStatus().status;
    this.poSync.prepare(schemas, config).then(() => {
      if (networkStatus) {
        if (newInstallation) {
          this.poSync.loadData();
        } else {
          this.poSync.sync();
        }
      }
    });
  }

  showExpires(): void {
    let date;
    let expires;
    if (this.network.getConnectionStatus()) {
      date = this.storageService.getUser().pwdExpires;
      let expires = date ? JSON.parse(date) : '';
      console.log(expires);
      if (!isNaN(expires) && expires < 6 && expires >= 0) {
        this.notification.warning({
          message: `Aviso! Sua senha vai expirar em ${expires} dias`,
        });
        window.sessionStorage.removeItem('notified');
        window.sessionStorage.setItem('notified', 'true');
        return;
      }
    } else {
      let expirationDate = this.storageService.getUser().pwdExpireDate;
      date = 30 - Math.ceil(expirationDate / (1000 * 3600 * 24));
      expires = date ? JSON.parse(String(date)) : '';
      console.log(expires);
      if (!isNaN(expires) && expires < 6 && expires >= 0) {
        this.notification.warning({
          message: `Aviso! Sua senha vai expirar em ${expires} dias`,
        });
        window.sessionStorage.removeItem('notified');
        window.sessionStorage.setItem('notified', 'true');
        return;
      }
    }
    return;
  }
}
