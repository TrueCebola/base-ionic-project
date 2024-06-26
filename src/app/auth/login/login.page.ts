import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonInput,
} from '@ionic/angular/standalone';
import {
  PoPageLogin,
  PoPageLoginAuthenticationType,
  PoPageLoginLiterals,
  PoPageLoginModule,
} from '@po-ui/ng-templates';
import {
  PoLanguage,
  PoModule,
  PoNotificationService,
  PoToasterOrientation,
} from '@po-ui/ng-components';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { StorageService } from '../services/storage.service';
import { AES } from 'crypto-js';
import * as crypto from 'crypto-js';
import { environment } from 'src/environments/environment';
import { PoNetworkService, PoNetworkType } from '@po-ui/ng-sync';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    IonInput,
    IonCardContent,
    IonCardTitle,
    IonCardHeader,
    IonCard,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    PoModule,
    FormsModule,
    PoPageLoginModule,
  ],
})
export class LoginPage implements OnInit {
  private authService = inject(AuthService);
  private storageService = inject(StorageService);
  private router = inject(Router);
  private notification = inject(PoNotificationService);
  private network = inject(PoNetworkService);
  constructor() {}

  private readonly _encrytion_key = environment.encryption_key;
  api_url = window.location.href.split('/');
  authType = PoPageLoginAuthenticationType.Bearer;
  authUrl = `${window.location.origin}/api/auth/signin`;
  buttonDisabled = false;
  errorMessage = '';
  hide = true;
  hideRemember = true;
  isExpired = false;
  isLoading = false;
  isLoggedIn = false;
  isLoginFailed = false;
  languages: Array<PoLanguage> = [{ language: 'pt', description: 'Português' }];
  literals: PoPageLoginLiterals = {
    loginErrorPattern: 'Login obrigatório',
    loginHint:
      'O usuário e a senha são os mesmos que você usa para fazer login no Windows ou GLPI',
    loginLabel: 'Usuário',
    loginPlaceholder: '',
    passwordErrorPattern: 'Senha obrigatória',
    passwordLabel: 'Senha',
    passwordPlaceholder: '',
    rememberUser: 'Lembrar Usuário',
    rememberUserHint: 'Remove a necessidade de fazer login novamente',
  };
  loginErrors: Array<string> = [];
  logo = environment.logo2Path;
  networkType!: PoNetworkType;
  passwordErrors: Array<string> = [];
  productName = 'SIAA';
  roles: string[] = [];
  spaceMessage!: string | undefined;
  timeOut?: number;

  @ViewChild('login', { static: true }) login!: PoPageLogin;

  checkSpaces(event: string): void {
    if (event.includes(' ')) {
      this.spaceMessage = 'Aviso! Sua senha possui espaços.';
    } else {
      this.spaceMessage = undefined;
    }
    if (
      !this.passwordErrors.includes('Aviso! Sua senha possui espaços.') &&
      this.spaceMessage
    ) {
      this.passwordErrors = [...this.passwordErrors, this.spaceMessage];
    } else if (
      this.passwordErrors.includes('Aviso! Sua senha possui espaços.') &&
      !this.spaceMessage
    ) {
      this.passwordErrors.splice(
        this.passwordErrors.indexOf('Aviso! Sua senha possui espaços.'),
        this.passwordErrors.indexOf('Aviso! Sua senha possui espaços.') + 1
      );
      this.passwordErrors = this.passwordErrors.splice(
        this.passwordErrors.indexOf('Aviso! Sua senha possui espaços.'),
        this.passwordErrors.indexOf('Aviso! Sua senha possui espaços.') + 1
      );
    }
    return;
  }

  dateDifference(data: Date) {
    let pwdate = new Date(data);
    let currentDate = new Date();
    let difference = currentDate.getTime() - pwdate.getTime();
    let date = 30 - Math.ceil(difference / (1000 * 3600 * 24));
    return date;
  }

  ngOnInit() {
    if (this.storageService.isLoggedIn()) {
      this.isLoggedIn = true;
      this.router.navigate(['/home']);
    }
  }

  onSubmit(data: PoPageLogin): void {
    const CRYPT_USER = AES.encrypt(data.login, this._encrytion_key).toString();
    const CRYPT_PWD = AES.encrypt(
      data.password,
      this._encrytion_key
    ).toString();
    const SAVE_LOGIN = data.rememberUser;
    let user_token: any;
    let networkStatus = this.network.getConnectionStatus().status;
    this.isLoading = true;
    if (networkStatus) {
      this.authService.login(CRYPT_USER, CRYPT_PWD, 'hybrid').subscribe({
        next: (data) => {
          this.storageService.saveUser(data);
          user_token = data.token;
          this.isLoggedIn = true;
          this.isLoginFailed = false;
          // this.reloadPage();
          this.buttonDisabled = true;
          return;
        },
        error: (err) => {
          switch (err.error.code) {
            case 423:
              this.isExpired = true;
              this.storageService.setExpired(true);
              this.router.navigate(['auth/senha-expirada']);
              this.isLoginFailed = true;
              this.isLoading = false;
              break;
            default:
              this.isExpired = false;
              this.isLoginFailed = true;
              this.isLoading = false;
              err.error
                ? this.notification.error(err.error)
                : this.notification.error(err.message);
              break;
          }
          return;
        },
        complete: () => {
          this.login.login = '';
          this.login.password = '';
          this.isLoading = false;
          let data: any = jwtDecode(window.sessionStorage.getItem('session')!);
          if (data) {
            let role = data.permissions.find(
              (permission: any) => permission.app === 'App'
            );
            if (role) {
              this.storageService.saveLocal({
                username: CRYPT_USER,
                password: CRYPT_PWD,
                info: user_token,
              });
              this.notification.success({
                duration: 2000,
                message: 'Login efetuado com sucesso!',
              });
              console.log('found');
              this.router.navigate(['tabs/tab1']);
              return;
            } else {
              this.storageService.setDenied(true);
              console.log('not found');
              this.router.navigate(['auth/sem-acesso']);
            }
          }
        },
      });
    } else {
      let local = this.storageService.getLocal();
      let index = local?.usuarios?.findIndex((item: any) => {
        return (
          AES.decrypt(item.username, this._encrytion_key)
            .toString(crypto.enc.Utf8)
            .toLowerCase() === data.login.toLowerCase()
        );
      });
      if (index !== -1 && index !== undefined) {
        if (
          AES.decrypt(
            local.usuarios[index].password,
            this._encrytion_key
          ).toString(crypto.enc.Utf8) === data.password
        ) {
          this.storageService.saveUser({
            token: local.usuarios[index].info,
            auth: true,
          });
          if (
            this.storageService.getUser().pwdExpires > 0 &&
            this.dateDifference(this.storageService.getUser().pwdExpireDate) > 0
          ) {
            // this.storageService.saveLocal({
            //   username: CRYPT_USER,
            //   password: CRYPT_PWD,
            //   info: local.usuarios[index].info,
            // });
            this.login.login = '';
            this.login.password = '';
            this.isLoading = false;
            this.notification.success({
              duration: 2000,
              message: 'Login efetuado com sucesso!',
            });
            this.router.navigate(['tabs/tab1']);
            return;
          } else {
            this.isLoginFailed = true;
            this.isLoading = false;
            this.router.navigate(['auth/senha-expirada']);
            return;
          }
        } else {
          this.isLoginFailed = true;
          this.isLoading = false;
          this.notification.error({
            message: 'Login ou senha inválidos!',
          });
          return;
        }
      } else {
        this.isLoginFailed = true;
        this.isLoading = false;
        this.notification.error({
          message:
            'Usuário não encontrado no registro offline! Para ter acesso, faça login online pelo menos uma vez.',
        });
        return;
      }
    }
  }

  reloadPage(): void {
    window.location.reload();
  }
}
