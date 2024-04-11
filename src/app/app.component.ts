import { Component, inject } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { Capacitor } from '@capacitor/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar } from '@capacitor/status-bar';
import {
  PoNetworkType,
  PoSyncConfig,
  PoSyncModule,
  PoSyncService,
} from '@po-ui/ng-sync';
import { conferenceSchema } from './tab2/conference-schema.constants';
import { StorageService } from './auth/services/storage.service';
import { PoNotificationService } from '@po-ui/ng-components';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet, PoSyncModule],
})
export class AppComponent {
  constructor(private platform: Platform, private poSync: PoSyncService) {
    this.initializeApp();
  }

  private storageService = inject(StorageService);
  private notification = inject(PoNotificationService);

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
      type: PoNetworkType.unknown,
    };
    const schemas = [conferenceSchema];
    this.poSync.prepare(schemas, config).then(() => {
      this.poSync.sync();
    });
  }

  showExpires(): void {
    let date = this.storageService.getUser().pwdExpires;
    let expires = date ? JSON.parse(date) : '';
    if (!isNaN(expires) && expires < 6 && expires >= 0) {
      this.notification.warning({
        message: `Aviso! Sua senha vai expirar em ${expires} dias`,
      });
      window.sessionStorage.removeItem('notified');
      window.sessionStorage.setItem('notified', 'true');
      return;
    }
    return;
  }
}
