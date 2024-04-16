import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { AES } from 'crypto-js';
import { environment } from 'src/environments/environment';
import * as crypto from 'crypto-js';

const TOKEN = 'session';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private readonly _encrytion_key = environment.encryption_key;
  constructor() {}

  clean(): void {
    window.sessionStorage.clear();
  }

  public getLocal(): any {
    const INFO = JSON.parse(window.localStorage.getItem('local-users')!);
    if (INFO) {
      return INFO;
    }
    return {};
  }

  public getUser(): any {
    const INFO = jwtDecode(window.sessionStorage.getItem(TOKEN)!);
    if (INFO) {
      return INFO;
    }
    return {};
  }

  public isExpired(): boolean {
    const EXPIRED = window.sessionStorage.getItem('expired-password');
    if (EXPIRED) {
      return true;
    }
    return false;
  }

  public isLoggedIn(): boolean {
    const AUTH = window.sessionStorage.getItem('auth');
    if (AUTH === 'true') {
      return true;
    }
    return false;
  }

  public saveLocal(data: any) {
    let temp: any;
    if (
      window.localStorage.getItem('local-users') &&
      window.localStorage.getItem('local-users') !== 'undefined' &&
      window.localStorage.getItem('local-users') !== 'null' &&
      window.localStorage.getItem('local-users') !== undefined &&
      window.localStorage.getItem('local-users') !== null
    ) {
      temp = JSON.parse(window.localStorage.getItem('local-users')!);
      if (temp?.usuarios) {
        let exists = temp.usuarios.find((item: any) => {
          return (
            AES.decrypt(item.username, this._encrytion_key)
              .toString(crypto.enc.Utf8)
              .toLowerCase() ===
            AES.decrypt(data.username, this._encrytion_key)
              .toString(crypto.enc.Utf8)
              .toLowerCase()
          );
        });
        if (exists) {
          return;
        } else {
          temp.usuarios = [...temp.usuarios, data];
        }
      } else {
        null;
      }
      window.localStorage.removeItem('local-users');
      window.localStorage.setItem('local-users', JSON.stringify(temp));
    } else {
      temp = { usuarios: [data] };
      window.localStorage.setItem('local-users', JSON.stringify(temp));
    }
  }

  public saveUser(data: any): void {
    window.sessionStorage.removeItem(TOKEN);
    window.sessionStorage.removeItem('auth');
    window.sessionStorage.setItem(TOKEN, data.token);
    window.sessionStorage.setItem('auth', data.auth);
  }

  public setExpired(expired: boolean) {
    if (expired) {
      window.sessionStorage.setItem(
        'expired-password',
        JSON.stringify(expired)
      );
      return;
    }
    window.sessionStorage.removeItem('expired-password');
    return;
  }
}
