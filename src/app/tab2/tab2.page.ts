import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
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
  PoButtonModule,
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
import { ActivatedRoute, Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { environment } from 'src/environments/environment';
import SignaturePad from 'signature_pad';
import { ThemeService } from '../shared/services/theme.service';

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
    PoButtonModule,
  ],
})
export class Tab2Page implements OnInit, AfterViewInit {
  @ViewChild('iconSpin', { read: ElementRef })
  iconSpin!: ElementRef<HTMLSpanElement>;
  @ViewChild('canvas') canvasEl!: ElementRef;

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
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private signatureImg!: string;
  private signatureNeeded!: boolean;
  private signaturePad!: SignaturePad;
  private storage = inject(StorageService);
  private tab2Edit: any;
  private tab2Model: PoEntity;
  private themeService = inject(ThemeService);
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
    input: new FormControl('', Validators.compose([Validators.required])),
    email: new FormControl(''),
    login: new FormControl('', Validators.compose([Validators.required])),
    password: new FormControl(''),
    number: new FormControl('', Validators.compose([Validators.required])),
    decimal: new FormControl(''),
    combo: new FormControl(''),
    multiselect: new FormControl(''),
    radio_group: new FormControl(''),
    checkbox_group: new FormControl(''),
    switch: new FormControl(''),
    signature: new FormControl('', Validators.required),
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
    this.form.reset();
    this.router.navigate(['tabs/tab1']);
  }

  clean() {
    this.form.reset();
  }

  drawStart($event: TouchEvent) {}

  drawMoved($event: TouchEvent) {}

  drawClear() {
    this.form.controls.signature.reset();
    this.signaturePad.clear();
  }

  drawSave() {
    const base64Data = this.signaturePad.toDataURL();
    this.signatureImg = base64Data;
    this.signatureNeeded = this.signaturePad.isEmpty();
    if (!this.signatureNeeded) {
      this.signatureNeeded = false;
      this.form.controls.signature.patchValue(this.signatureImg);
    } else {
      this.notification.warning({
        message: 'O campo de assinatura não pode ser vazio!',
        duration: 4000,
      });
    }
  }

  edit(): void {
    if (this.form.invalid) return;
    this.isLoading = true;
    setTimeout(() => {
      // this.tab2Model.save(this.form.value).then(() => {
      this.isLoading = false;
      this.notification.success({
        message: 'Alterações aplicadas com sucesso!',
        duration: 1500,
      });
      this.cancel();
      // });
      // this.service.put(this.form.value, this.id).subscribe({
      //   next: () => {
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
    }, this.timeOut);
  }

  ionViewDidEnter() {
    this.route.queryParams.subscribe((params) => (this.id = params['id']));
    if (this.id) {
      this.loadEdit(this.id);
      this.literals = {
        save: 'Aplicar',
      };
      this.isEdit = true;
      this.title = 'Editar Tab2';
      // this.form.patchValue({
      //   input: edit,
      // });
      // this.service.get(this.id).subscribe({
      //   next: (data) => {
      //     this.registro.patchValue({
      //       funcionario: data.items[0].label,
      //       funcao: data.items[0].funcao,
      //       volante: data.items[0].volante,
      //       turno: data.items[0].turno,
      //       dateStart: data.items[0].dateStart,
      //       dateEnd: data.items[0].dateEnd,
      //     });
      //   },
      //   error: () => {
      //     return;
      //   },
      // });
    } else {
      this.literals = {
        save: 'Cadastrar',
      };
      this.isEdit = false;
      this.title = 'Form Tab2';
      this.form.reset();
    }
  }

  ionViewWillEnter() {
    if (this.storage.getTheme() === 'dark') {
      this.themeService.applyDark();
    } else {
      this.themeService.removeDark();
    }
  }

  async loadEdit(id: number) {
    this.tab2Edit = await this.tab2Model.findById(id).exec();
    this.form.patchValue({
      input: this.tab2Edit.title,
      login: this.tab2Edit.description,
      number: this.tab2Edit.id,
    });
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
        message:
          'Sem conexão com a internet. Tente novamente assim que tiver uma conexão.',
      });
      this.animation.stop();
      this.syncText = 'Sincronizar';
      this.syncIcon = 'wifi_off';
      this.syncing = false;
    }
    return;
  }

  ngAfterViewInit() {
    this.signaturePad = new SignaturePad(this.canvasEl.nativeElement, {
      throttle: 0,
      minDistance: 0,
      velocityFilterWeight: 0.7,
    });
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

  onSubmit(): void {
    if (this.form.invalid) return;
    this.isLoading = true;
    this.form.reset();
    setTimeout(() => {
      // this.tab2Model.save(this.form.value).then(() => {
      this.isLoading = false;
      this.notification.success({
        message: 'Form cadastrado com sucesso!',
        duration: 1500,
      });
      // this.cancel();
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
    }, this.timeOut);
  }

  paginate(array: any[], page: number, pageSize: number) {
    return array.slice(0, page * pageSize);
  }

  resizeCanvas() {
    let ratio = Math.max(window.devicePixelRatio || 1, 1);

    this.canvasEl.nativeElement.width =
      this.canvasEl.nativeElement.offsetWidth * ratio;
    this.canvasEl.nativeElement.height =
      this.canvasEl.nativeElement.offsetHeight * ratio;
    this.canvasEl.nativeElement.getContext('2d').scale(ratio, ratio);

    this.signaturePad.clear();
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
