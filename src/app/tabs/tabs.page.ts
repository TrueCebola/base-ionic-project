import {
  AfterViewInit,
  Component,
  EnvironmentInjector,
  OnInit,
  inject,
} from '@angular/core';
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
  IonRouterOutlet,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  triangle,
  ellipse,
  square,
  logOutOutline,
  personCircleOutline,
  moonOutline,
  sunnyOutline,
} from 'ionicons/icons';
import { AuthService } from '../auth/services/auth.service';
import { StorageService } from '../auth/services/storage.service';
import { Router } from '@angular/router';
import { PoNetworkService } from '@po-ui/ng-sync';
import {
  PoDialogService,
  PoLoadingModule,
  PoNotificationService,
  PoToasterOrientation,
} from '@po-ui/ng-components';
import * as darkReader from 'darkreader';
import { ThemeService } from '../shared/services/theme.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  standalone: true,
  imports: [
    IonRouterOutlet,
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
    PoLoadingModule,
  ],
})
export class TabsPage {
  constructor() {
    addIcons({
      triangle,
      ellipse,
      square,
      personCircleOutline,
      logOutOutline,
      sunnyOutline,
      moonOutline,
    });
  }

  private authService = inject(AuthService);
  private dialog = inject(PoDialogService);
  private network = inject(PoNetworkService);
  private notification = inject(PoNotificationService);
  private router = inject(Router);
  private storageService = inject(StorageService);
  private theme!: string;
  private themeIcon!: string;
  private themeOptions = {
    brightness: 100,
    contrast: 90,
    sepia: 0,
  };
  private themeService = inject(ThemeService);
  private themeText!: string;
  public actionSheetButtons = [
    {
      text: this.themeText,
      role: 'destructive',
      icon: this.themeIcon,
      handler: () => {
        this.theme === 'escuro'
          ? this.themeChange('claro')
          : this.themeChange('escuro');
        this.notification.information({
          message:
            'Para o tema ser alterado corretamente, reinicie o aplicativo.',
          duration: 4000,
        });
      },
    },
    {
      text: 'Desconectar',
      role: 'destructive',
      icon: 'log-out-outline',
      handler: () => {
        this.dialog.confirm({
          confirm: this.logout.bind(this),
          literals: { confirm: 'Desconectar' },
          message: 'Deseja realmente desconectar do aplicativo?',
          title: 'Desconectar',
        });
      },
    },
  ];
  public environmentInjector = inject(EnvironmentInjector);
  public isLoading = false;

  ionViewWillEnter() {
    if (this.storageService.getTheme() === 'dark') {
      this.themeChange('escuro');
    } else {
      this.themeChange('claro');
    }
  }

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

  themeChange(theme: string) {
    this.isLoading = true;
    switch (theme) {
      case 'claro':
        this.theme = theme;
        this.themeIcon = 'moon-outline';
        this.themeText = `Mudar para tema escuro`;
        this.actionSheetButtons[0].icon = this.themeIcon;
        this.actionSheetButtons[0].text = this.themeText;
        this.themeService.removeDark();
        // darkReader.disable();
        break;
      case 'escuro':
        this.theme = theme;
        this.themeIcon = 'sunny-outline';
        this.themeText = `Mudar para tema claro`;
        this.actionSheetButtons[0].icon = this.themeIcon;
        this.actionSheetButtons[0].text = this.themeText;
        this.themeService.applyDark();
        // darkReader.enable(this.themeOptions);
        break;
      default:
        break;
    }
    this.isLoading = false;
  }
}
