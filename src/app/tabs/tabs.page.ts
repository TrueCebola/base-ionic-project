import { Component, EnvironmentInjector, inject } from '@angular/core';
import {
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
  IonActionSheet,
  IonContent,
  IonHeader,
  IonFooter,
  IonToolbar,
  IonTitle,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  triangle,
  ellipse,
  square,
  logOutOutline,
  personCircleOutline,
} from 'ionicons/icons';
import { AuthService } from '../auth/services/auth.service';
import { StorageService } from '../auth/services/storage.service';
import { Router } from '@angular/router';
import { PoNetworkService } from '@po-ui/ng-sync';
import {
  PoNotificationService,
  PoToasterOrientation,
} from '@po-ui/ng-components';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  standalone: true,
  imports: [
    IonTitle,
    IonToolbar,
    IonFooter,
    IonHeader,
    IonContent,
    IonActionSheet,
    IonTabs,
    IonTabBar,
    IonTabButton,
    IonIcon,
    IonLabel,
  ],
})
export class TabsPage {
  constructor() {
    addIcons({ triangle, ellipse, square, personCircleOutline, logOutOutline });
  }

  private authService = inject(AuthService);
  private network = inject(PoNetworkService);
  private notification = inject(PoNotificationService);
  private router = inject(Router);
  private storageService = inject(StorageService);

  public actionSheetButtons = [
    {
      text: 'Desconectar',
      role: 'destructive',
      icon: 'log-out-outline',
      handler: () => {
        this.logout();
      },
    },
  ];

  public environmentInjector = inject(EnvironmentInjector);

  logout() {
    let networkStatus = this.network.getConnectionStatus().status;
    if (networkStatus) {
      this.authService.logout().subscribe({
        next: () => {
          this.storageService.clean();
          return;
        },
        error: () => {
          return;
        },
        complete: () => {
          this.router.navigate(['auth/login']);
          this.notification.success({
            duration: 2000,
            message: 'Desconectou com sucesso!',
          });
          return;
        },
      });
    } else {
      this.storageService.clean();
      this.router.navigate(['auth/login']);
      this.notification.success({
        duration: 2000,
        message: 'Desconectou com sucesso!',
      });
    }
  }
}
