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

  public getTheme() {
    const THEME = window.localStorage.getItem('theme')!;
    if (THEME) {
      return THEME;
    }
    return null;
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

  public isDenied(): boolean {
    const DENIED = window.sessionStorage.getItem('denied-access');
    if (DENIED) {
      return true;
    }
    return false;
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
    let users: any;
    let local_users = window.localStorage.getItem('local-users');
    if (
      local_users &&
      local_users !== 'undefined' &&
      local_users !== 'null' &&
      local_users !== undefined &&
      local_users !== null
    ) {
      users = JSON.parse(window.localStorage.getItem('local-users')!);
      if (users?.usuarios) {
        let exists = users.usuarios.find((item: any) => {
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
          users.usuarios = [...users.usuarios, data];
        }
      } else {
        null;
      }
      window.localStorage.removeItem('local-users');
      window.localStorage.setItem('local-users', JSON.stringify(users));
    } else {
      users = { usuarios: [data] };
      window.localStorage.setItem('local-users', JSON.stringify(users));
    }
  }

  public saveTheme(theme: string) {
    let currentTheme = window.matchMedia('(prefers-color-scheme: dark)');
    if (window.localStorage.getItem('theme')) {
      window.localStorage.removeItem('theme');
      window.localStorage.setItem('theme', theme);
    } else {
      if (currentTheme) {
        window.localStorage.setItem('theme', 'dark');
      } else {
        window.localStorage.setItem('theme', 'light');
      }
    }
  }

  public saveUser(data: any): void {
    window.sessionStorage.removeItem(TOKEN);
    window.sessionStorage.removeItem('auth');
    window.sessionStorage.setItem(TOKEN, data.token);
    window.sessionStorage.setItem('auth', data.auth);
  }

  public setDenied(denied: boolean) {
    if (denied) {
      window.sessionStorage.setItem('denied-access', JSON.stringify(denied));
      return;
    }
    window.sessionStorage.removeItem('denied-access');
    return;
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
