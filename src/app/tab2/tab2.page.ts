import { Component } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardTitle,
  IonSkeletonText,
  IonCardHeader,
} from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { PoSyncService } from '@po-ui/ng-sync';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [
    IonCardHeader,
    IonSkeletonText,
    IonButton,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonCard,
    IonCardContent,
    IonCardTitle,
    ExploreContainerComponent,
  ],
})
export class Tab2Page {
  conference: any;
  loading = true;

  constructor(private poSync: PoSyncService) {
    this.poSync.onSync().subscribe(() => this.loadHomePage());
  }

  async loadHomePage() {
    this.conference = await this.poSync.getModel('conference').findOne().exec();
    this.loading = false;
  }

  clear() {
    this.conference = null;
  }
}
