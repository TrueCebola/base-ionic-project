import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import {
  PoPageBlockedUserModule,
  PoPageBlockedUserReason,
  PoPageBlockedUserReasonParams,
} from '@po-ui/ng-templates';
import { AuthService } from '../services/auth.service';
import { StorageService } from '../services/storage.service';
import { PoNetworkService } from '@po-ui/ng-sync';

@Component({
  selector: 'app-sem-acesso',
  templateUrl: './sem-acesso.page.html',
  styleUrls: ['./sem-acesso.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    PoPageBlockedUserModule,
  ],
})
export class SemAcessoPage implements OnInit {
  constructor() {}
  private authService = inject(AuthService);
  private network = inject(PoNetworkService);
  private storageService = inject(StorageService);
  public logo = '../../../assets/logo_cambuhy_2.png';
  public params: PoPageBlockedUserReasonParams = {};
  public reason = PoPageBlockedUserReason.None;
  public url = 'auth/login';

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
          return;
        },
      });
    } else {
      this.storageService.clean();
    }
  }

  ngOnInit() {
    this.logout();
  }
}
