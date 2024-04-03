import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

const TOKEN = 'session';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor(private router: Router) {}

  clean(): void {
    window.sessionStorage.clear();
  }

  public saveUser(data: any): void {
    window.sessionStorage.removeItem(TOKEN);
    window.sessionStorage.removeItem('auth');
    window.sessionStorage.setItem(TOKEN, data.token);
    window.sessionStorage.setItem('auth', data.auth);
  }

  public getUser(): any {
    const INFO = jwtDecode(window.sessionStorage.getItem(TOKEN)!);
    if (INFO) {
      return INFO;
    }
    return {};
  }

  public isLoggedIn(): boolean {
    const AUTH = window.sessionStorage.getItem('auth');
    if (AUTH === 'true') {
      return true;
    }
    return false;
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

  public isExpired(): boolean {
    const EXPIRED = window.sessionStorage.getItem('expired-password');
    if (EXPIRED) {
      return true;
    }
    return false;
  }
}
