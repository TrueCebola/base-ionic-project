import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { AES } from 'crypto-js';
import { environment } from 'src/environments/environment';

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
    const INFO = JSON.parse(window.localStorage.getItem('teste')!);
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
      window.localStorage.getItem('teste') &&
      window.localStorage.getItem('teste') !== 'undefined' &&
      window.localStorage.getItem('teste') !== 'null' &&
      window.localStorage.getItem('teste') !== undefined &&
      window.localStorage.getItem('teste') !== null
    ) {
      temp = JSON.parse(window.localStorage.getItem('teste')!);
      if (temp?.usuarios) {
        let exists = temp.usuarios.find((item: any) => {
          return (
            String(
              AES.decrypt(item.username, this._encrytion_key)
            ).toLowerCase() ===
            String(
              AES.decrypt(data.username, this._encrytion_key)
            ).toLowerCase()
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
      window.localStorage.removeItem('teste');
      window.localStorage.setItem('teste', JSON.stringify(temp));
    } else {
      temp = { usuarios: [data] };
      window.localStorage.setItem('teste', JSON.stringify(temp));
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
