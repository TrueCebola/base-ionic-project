import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  auth_api = `${environment.apiUrl}/auth`;

  constructor() {}

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.auth_api}/signin`, {
      username,
      password,
    });
  }

  logout(): Observable<any> {
    return this.http.post(`${this.auth_api}/signout`, {});
  }
}
