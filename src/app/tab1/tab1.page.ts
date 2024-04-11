import { Component } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonButton,
  IonIcon,
} from '@ionic/angular/standalone';
import { PoPageModule, PoTableModule } from '@po-ui/ng-components';
import { addIcons } from 'ionicons';
import { cellularOutline, wifiOutline } from 'ionicons/icons';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [
    IonIcon,
    IonButton,
    IonButtons,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    PoTableModule,
    PoPageModule,
  ],
})
export class Tab1Page {
  constructor() {
    addIcons({ cellularOutline, wifiOutline });
  }
}
