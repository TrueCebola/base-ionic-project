import { Component, EnvironmentInjector, inject } from '@angular/core';
import {
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
  IonActionSheet,
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

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  standalone: true,
  imports: [
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
  private storageService = inject(StorageService);
  private router = inject(Router);

  public actionSheetButtons = [
    {
      text: 'Desconectar',
      role: 'destructive',
      icon: 'log-out-outline',
      handler: () => {
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
            return;
          },
        });
      },
    },
  ];

  public environmentInjector = inject(EnvironmentInjector);
}
