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
import { conferenceSchema } from './conference-schema.constants';
import { StorageService } from './auth/services/storage.service';
import { PoModule, PoNotificationService } from '@po-ui/ng-components';
import * as darkReader from 'darkreader';
import { BehaviorSubject } from 'rxjs';
import { ThemeService } from './shared/services/theme.service';

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

  private notification = inject(PoNotificationService);
  private network = inject(PoNetworkService);
  private storageService = inject(StorageService);
  private themeOptions = {
    brightness: 100,
    contrast: 90,
    sepia: 0,
  };
  private themeService = inject(ThemeService);

  async initializeApp() {
    let theme = this.storageService.getTheme();
    let preference = window.matchMedia('(prefers-color-scheme: dark)');
    switch (theme) {
      case 'dark':
        this.themeService.applyDark();
        break;
      case 'light':
        this.themeService.removeDark();
        break;
      default:
        if (preference.matches) {
          this.themeService.applyDark();
        } else {
          this.themeService.removeDark();
        }
        break;
    }
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
    const networkStatus = this.network.getConnectionStatus().status;
    this.poSync.prepare(schemas, config).then(() => {
      if (networkStatus) {
        this.poSync.sync();
      }
    });
  }

  showExpires(): void {
    let date;
    let expires;
    if (this.network.getConnectionStatus()) {
      date = this.storageService.getUser().pwdExpires;
      let expires = date ? JSON.parse(date) : '';
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
