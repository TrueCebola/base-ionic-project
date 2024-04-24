import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonCardHeader,
  IonButtons,
  AnimationController,
  Animation,
} from '@ionic/angular/standalone';
import {
  PoCheckboxGroupOption,
  PoComboComponent,
  PoContainerModule,
  PoFieldModule,
  PoNotificationService,
  PoPageAction,
  PoPageEditLiterals,
  PoPageModule,
  PoRadioGroupOption,
} from '@po-ui/ng-components';
import { PoEntity, PoNetworkService, PoSyncService } from '@po-ui/ng-sync';
import { StorageService } from '../auth/services/storage.service';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [
    IonButtons,
    IonCardHeader,
    IonButton,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    PoPageModule,
    PoFieldModule,
    PoContainerModule,
    FormsModule,
    ReactiveFormsModule,
    NgIf,
  ],
})
export class Tab2Page implements OnInit, AfterViewInit {
  @ViewChild('iconSpin', { read: ElementRef })
  iconSpin!: ElementRef<HTMLSpanElement>;

  constructor() {
    this.tab2Model = this.poSync.getModel('conference');
    this.poSync.onSync().subscribe(() => this.loadSchema());
    this.loadSchema();
    this.isOnline = this.network.getConnectionStatus().status;
  }

  private animation!: Animation;
  private animationCtrl = inject(AnimationController);
  private baseItems: any[] = [];
  private currentPage = 1;
  private currentPageSize = 10;
  private info: any;
  private network = inject(PoNetworkService);
  private notification = inject(PoNotificationService);
  private poSync = inject(PoSyncService);
  private router = inject(Router);
  private storage = inject(StorageService);
  private tab2Model: PoEntity;
  public canCreate: boolean = false;
  public canDelete: boolean = false;
  public canUpdate: boolean = false;
  public checkboxOptions: PoCheckboxGroupOption[] = [
    {
      value: '1',
      label: 'Option 1',
    },
    {
      value: '2',
      label: 'Option 2',
    },
  ];
  public dummyArray = new Array(5);
  public error = null;
  public form = new FormGroup({
    input: new FormControl(''),
    email: new FormControl(''),
    login: new FormControl(''),
    password: new FormControl(''),
    number: new FormControl(''),
    decimal: new FormControl(''),
    combo: new FormControl(''),
    multiselect: new FormControl(''),
    radio_group: new FormControl(''),
    checkbox_group: new FormControl(''),
  });
  public getMore: boolean = true;
  public id!: number;
  public isEdit: boolean = false;
  public isLoaded: boolean = false;
  public isLoading: boolean = false;
  public isOnline: boolean = false;
  public isSuccessful: boolean = false;
  public items: any[] = [];
  public literals: PoPageEditLiterals = {
    save: 'Cadastrar',
  };
  public loadingMore: boolean = false;
  public loadingTable: boolean = false;
  public comboApi: string =
    'https://po-sample-conference.onrender.com/conferences';
  public radioOptions: PoRadioGroupOption[] = [
    {
      value: 1,
      label: 'Option 1',
    },
    {
      value: 2,
      label: 'Option 2',
    },
  ];
  public syncIcon = 'sync';
  public syncing: boolean = false;
  public syncText: string = 'Sincronizar';
  public tab2: any;
  public timeOut!: number;
  public title: string = 'Form Tab2';
  public username!: string;

  cancel(): void {
    this.router.navigate(['tabs/tab1']);
  }

  clean() {
    this.form.reset();
  }

  edit(): void {
    // this.service.put(this.form.value, this.id).subscribe({
    //   next: () => {
    //     this.cancel();
    //     return;
    //   },
    //   error: () => {
    //     return;
    //   },
    // });
  }

  loadMore() {
    this.loadingMore = true;
    this.currentPage++;
    this.setItems(event);
    this.loadingMore = false;
  }

  async loadSchema() {
    this.tab2 = await this.tab2Model.find().sort('-id').exec();
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
            message: 'Sincronização concluída!',
          });
          this.animation.stop();
          this.syncText = 'Sincronizar';
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
    this.isLoaded = true;
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

  paginate(array: any[], page: number, pageSize: number) {
    return array.slice(0, page * pageSize);
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    console.log(this.form.value);
    // this.isLoading = true;
    // setTimeout(() => {
    // this.tab2Model.save(this.form.value).then(() => {
    //   this.isLoading = false;
    //   this.notification.success('Indicador salvo com sucesso!');
    // });
    // this.service.post(this.form.value).subscribe({
    //   next: (data) => {
    //     this.cancel();
    //     return;
    //   },
    //   error: () => {
    //     return;
    //   },
    //   complete: () => {
    //     this.isLoading = false;
    //     return;
    //   },
    // });
    // }, this.timeOut);
  }

  setItems(event: any) {
    this.loadingTable = true;
    this.baseItems = this.tab2.items;
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
