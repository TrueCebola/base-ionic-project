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
  PoNotificationService,
  PoToasterOrientation,
} from '@po-ui/ng-components';
import * as darkReader from 'darkreader';

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
  ],
})
export class TabsPage implements OnInit {
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
  private themeText!: string;

  public actionSheetButtons = [
    // {
    //   text: this.themeText,
    //   role: 'destructive',
    //   icon: this.themeIcon,
    //   handler: () => {
    //     this.themeChange();
    //   },
    // },
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

  ngOnInit() {
    // if (darkReader.isEnabled()) {
    //   this.theme = 'escuro';
    //   this.themeIcon = 'moon-outline';
    //   this.themeText = `Mudar para tema claro`;
    //   this.actionSheetButtons[0].icon = this.themeIcon;
    //   this.actionSheetButtons[0].text = this.themeText;
    //   document.querySelector('body')?.classList.add('dark');
    // } else {
    //   this.theme = 'claro';
    //   this.themeIcon = 'sunny-outline';
    //   this.themeText = `Mudar para tema escuro`;
    //   this.actionSheetButtons[0].icon = this.themeIcon;
    //   this.actionSheetButtons[0].text = this.themeText;
    //   document.querySelector('body')?.classList.remove('dark');
    // }
  }

  themeChange() {
    switch (this.theme) {
      case 'escuro':
        this.theme = 'claro';
        this.themeIcon = 'sunny-outline';
        this.themeText = `Mudar para tema escuro`;
        this.actionSheetButtons[0].icon = this.themeIcon;
        this.actionSheetButtons[0].text = this.themeText;
        document.querySelector('body')?.classList.remove('dark');
        darkReader.disable();
        this.storageService.saveTheme('light');
        break;
      case 'claro':
        this.theme = 'escuro';
        this.themeIcon = 'moon-outline';
        this.themeText = `Mudar para tema claro`;
        this.actionSheetButtons[0].icon = this.themeIcon;
        this.actionSheetButtons[0].text = this.themeText;
        document.querySelector('body')?.classList.add('dark');
        darkReader.enable(this.themeOptions);
        console.log(darkReader.exportGeneratedCSS());
        this.storageService.saveTheme('dark');
        break;
      default:
        break;
    }
  }
}
