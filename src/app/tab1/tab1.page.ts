import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonButton,
  IonIcon,
  AnimationController,
  Animation,
} from '@ionic/angular/standalone';
import {
  PoDisclaimerGroup,
  PoNotificationService,
  PoPageAction,
  PoPageFilter,
  PoPageModule,
  PoTableColumn,
  PoTableModule,
  PoToasterOrientation,
} from '@po-ui/ng-components';
import { PoEntity, PoNetworkService, PoSyncService } from '@po-ui/ng-sync';
import { addIcons } from 'ionicons';
import { cellularOutline, wifiOutline } from 'ionicons/icons';
import { environment } from 'src/environments/environment';

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
export class Tab1Page implements AfterViewInit {
  @ViewChild('iconSpin', { read: ElementRef })
  iconSpin!: ElementRef<HTMLSpanElement>;

  constructor() {
    addIcons({ cellularOutline, wifiOutline });
    this.tab1Model = this.poSync.getModel('conference');
    this.poSync.onSync().subscribe(() => this.loadSchema());
    this.loadSchema();
  }

  private animation!: Animation;
  private animationCtrl = inject(AnimationController);
  private baseItems: any[] = [];
  private currentPage = 1;
  private currentPageSize = 10;
  private network = inject(PoNetworkService);
  private notification = inject(PoNotificationService);
  private poSync = inject(PoSyncService);
  private tab1Model: PoEntity;
  public actions: PoPageAction[] = [
    {
      label: 'Novo',
      url: 'tabs/tab2',
    },
  ];
  public columns: PoTableColumn[] = [
    { property: 'id' },
    { property: 'title' },
    { property: 'location' },
    { property: 'description' },
  ];
  public disclaimerGroup: PoDisclaimerGroup = {
    change: this.disclaimerChange.bind(this),
    disclaimers: [],
    remove: this.disclaimerChange.bind(this),
    removeAll: this.disclaimerChange.bind(this),
    title: 'Filtros',
  };
  public dummyArray = new Array(5);
  public error = null;
  public filter: PoPageFilter = {
    action: this.quickSearch.bind(this),
    // advancedAction: this.searchModal.bind(this),
    placeholder: 'Busca rápida',
  };
  public getMore = true;
  public items: any[] = [];
  public tab1: any;
  public loadingTable = false;
  public loadingMore = false;
  public syncing = false;
  public syncIcon = 'sync';
  public syncText = 'Sincronizar';

  clean() {
    this.baseItems = [];
    this.currentPage = 1;
    this.items = [];
  }

  disclaimerChange(change: any) {
    console.log(change);
  }

  loadMore() {
    this.loadingMore = true;
    this.currentPage++;
    this.setItems(event);
    this.loadingMore = false;
  }

  async loadSchema() {
    this.tab1 = await this.tab1Model.find().sort('-id').exec();
    this.setItems(true);
    this.loadingTable = false;
    this.syncing = false;
  }

  manualSync() {
    let networkStatus = this.network.getConnectionStatus().status;
    this.syncing = true;
    this.syncIcon = 'sync';
    this.animation.play();
    this.syncText = 'Sincronizando';
    if (networkStatus) {
      this.poSync
        .sync()
        .then(() => {
          this.notification.success({
            message: 'Sincronização concluída!',
          });
        })
        .catch(() => {
          this.notification.error({
            message:
              'Ocorreu um erro na sincronização. Tente novamente mais tarde.',
            orientation: PoToasterOrientation.Top,
          });
          this.syncIcon = 'sync_problem';
        });
    } else {
      this.notification.error({
        message: 'Sem conexão com a internet. Tente novamente mais tarde.',
        orientation: PoToasterOrientation.Top,
      });
      this.syncIcon = 'wifi_off';
    }
    this.animation.stop();
    this.syncText = 'Sincronizar';
    this.syncing = false;
    return;
  }

  ngAfterViewInit() {
    this.animation = this.animationCtrl
      .create()
      .addElement(this.iconSpin.nativeElement)
      .duration(600)
      .iterations(Infinity)
      .fromTo('transform', 'rotate(0deg)', 'rotate(-360deg)');
  }

  paginate(array: any[], page: number, pageSize: number) {
    return array.slice(0, page * pageSize);
  }

  async quickSearch(search: string) {
    this.tab1 = await this.tab1Model.find().sort('-id').exec();
  }

  setItems(event: any) {
    this.baseItems = this.tab1.items;
    this.items = this.paginate(
      this.baseItems,
      this.currentPage,
      this.currentPageSize
    );
    if (this.items.length === this.baseItems.length) {
      this.getMore = false;
    }
    if (event) {
      event = this.items.length === this.baseItems.length;
    }
  }
}
