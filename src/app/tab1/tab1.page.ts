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
  PoModalComponent,
  PoModalModule,
  PoNotificationService,
  PoPageAction,
  PoPageFilter,
  PoPageModule,
  PoTableColumn,
  PoTableColumnSpacing,
  PoTableModule,
  PoToasterOrientation,
  PoTooltipModule,
} from '@po-ui/ng-components';
import { PoEntity, PoNetworkService, PoSyncService } from '@po-ui/ng-sync';
import { addIcons } from 'ionicons';
import { cellularOutline, wifiOutline } from 'ionicons/icons';
import { environment } from 'src/environments/environment';
import { StorageService } from '../auth/services/storage.service';
import { NgTemplateOutlet } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

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
    PoModalModule,
    NgTemplateOutlet,
    PoTooltipModule,
  ],
})
export class Tab1Page implements OnInit, AfterViewInit {
  @ViewChild('confirmExclusion', { static: true })
  exclusionModal!: PoModalComponent;
  @ViewChild('export', { static: true }) exportModal!: PoModalComponent;
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
  private exclusionId!: number;
  private info: any;
  private network = inject(PoNetworkService);
  private notification = inject(PoNotificationService);
  private poSync = inject(PoSyncService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private storage = inject(StorageService);
  private tab1Model: PoEntity;
  public actions: PoPageAction[] = [
    {
      label: 'Novo',
      url: 'tabs/tab2',
    },
  ];
  public canCreate = false;
  public canUpdate = false;
  public canDelete = false;
  public columns: PoTableColumn[] = [
    { property: 'edit', type: 'cellTemplate' },
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
  public tableSpacing = PoTableColumnSpacing.Small;
  public syncing = false;
  public syncIcon = 'sync';
  public syncText = 'Sincronizar';

  clean() {
    this.baseItems = [];
    this.currentPage = 1;
    this.items = [];
  }

  closeExclusion() {
    this.exclusionModal.close();
  }

  closeExport() {
    this.exportModal.close();
  }

  disclaimerChange(change: any) {
    if (change.removedDisclaimer) {
      this.quickSearch('');
    }
  }

  editar(id: number) {
    this.router.navigate([`tabs/tab2`], {
      queryParams: { id: id },
    });
  }

  excluir(id: number) {
    this.closeExclusion();
    this.notification.success({
      message: 'Item excluído com sucesso!',
      duration: 1500,
    });
    // this.service.delete(id).subscribe({
    //   next: (data) => {
    //     this.serviceApi = '';
    //     setTimeout(() => {
    //       this.serviceApi = this.baseApi;
    //     }, 100);
    //     return;
    //   },
    //   error: (err) => {
    //     this.serviceApi = '';
    //     setTimeout(() => {
    //       this.serviceApi = this.baseApi;
    //     }, 100);
    //     return;
    //   },
    // });
  }

  exclusion(): void {
    this.excluir(this.exclusionId);
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
    this.syncing = false;
  }

  manualSync() {
    let networkStatus = this.network.getConnectionStatus().status;
    this.syncing = true;
    this.syncIcon = 'sync';
    this.syncText = 'Sincronizando';
    this.animation.play();
    if (networkStatus) {
      this.poSync
        .sync()
        .then(() => {
          this.notification.success({
            message: 'Sincronização concluída com sucesso!',
            duration: 2000,
          });
          this.animation.stop();
          this.syncIcon = 'sync_saved_locally';
          this.syncText = 'Sincronizado';
          setTimeout(() => {
            this.syncIcon = 'sync';
            this.syncText = 'Sincronizar';
          }, 2000);
          this.syncing = false;
          this.loadSchema();
        })
        .catch(() => {
          this.notification.error({
            message:
              'Ocorreu um erro na sincronização. Tente novamente mais tarde.',
          });
          this.animation.stop();
          this.syncText = 'Sincronizar';
          this.syncIcon = 'sync_problem';
          this.syncing = false;
        });
    } else {
      this.notification.error({
        message: 'Sem conexão com a internet. Tente novamente mais tarde.',
      });
      this.animation.stop();
      this.syncText = 'Sincronizar';
      this.syncIcon = 'wifi_off';
      this.syncing = false;
    }
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

  ngOnInit() {
    this.info = this.storage.getUser();
    let app = this.info.permissions.find(
      (permission: any) => permission.name === ''
    );
    // this.canCreate = app.create;
    // this.canUpdate = app.update;
    // this.canDelete = app.delete;
    // this.actions[0].visible = this.canCreate;
    // if (this.canUpdate || this.canDelete) {
    //   this.columns[0].visible = true;
    // } else {
    //   this.columns[0].visible = false;
    // }
  }

  openExclusion(id: number) {
    this.exclusionId = id;
    this.exclusionModal.open();
  }

  paginate(array: any[], page: number, pageSize: number) {
    return array.slice(0, page * pageSize);
  }

  async quickSearch(search: string) {
    if (search) {
      this.tab1 = await this.tab1Model.find().filter({ title: search }).exec();
      this.disclaimerGroup.disclaimers = [
        ...this.disclaimerGroup.disclaimers,
        { property: 'title', label: `Busca rápida: ${search}`, value: search },
      ];
    } else {
      this.tab1 = await this.tab1Model.find().sort('-id').exec();
    }
    this.setItems(true);
    this.syncing = false;
  }

  setItems(event: any) {
    this.loadingTable = true;
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
    this.loadingTable = false;
  }
}
