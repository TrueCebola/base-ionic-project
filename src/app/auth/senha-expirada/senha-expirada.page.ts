import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-senha-expirada',
  templateUrl: './senha-expirada.page.html',
  styleUrls: ['./senha-expirada.page.scss'],
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
export class SenhaExpiradaPage implements OnInit {
  constructor() {}
  logo = '../../../assets/logo_cambuhy_2.png';
  params: PoPageBlockedUserReasonParams = {
    days: 30,
  };
  reason = PoPageBlockedUserReason.ExpiredPassword;
  url = 'auth/login';

  ngOnInit() {}
}
