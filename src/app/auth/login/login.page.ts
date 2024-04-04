import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
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
} from '@po-ui/ng-components';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { StorageService } from '../services/storage.service';
import { AES } from 'crypto-js';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
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
  constructor(
    private authService: AuthService,
    private storageService: StorageService,
    private router: Router,
    private notification: PoNotificationService
  ) {}

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
  logo = '../../../assets/logo_cambuhy_2.png';
  passwordErrors: Array<string> = [];
  productName = 'SIAA';
  roles: string[] = [];
  spaceMessage!: string | undefined;
  timeOut?: number;

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
    this.isLoading = true;
    this.authService.login(CRYPT_USER, CRYPT_PWD).subscribe({
      next: (data) => {
        this.storageService.saveUser(data);
        this.isLoggedIn = true;
        this.isLoginFailed = false;
        // this.reloadPage();
        this.buttonDisabled = true;
        this.notification.success('Login efetuado com sucesso!');
        setTimeout(() => {
          this.router.navigate(['tabs/tab1']);
        }, 1000);
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
            this.notification.error(err.error);
            break;
        }
        return;
      },
      complete: () => {
        return;
      },
    });
  }

  reloadPage(): void {
    window.location.reload();
  }
}
