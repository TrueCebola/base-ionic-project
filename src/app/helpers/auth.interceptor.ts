import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor() {}

  /**
   * Intercepts the HTTP request and adds the session token to the headers if it exists.
   *
   * @param {HttpRequest<any>} req - The HTTP request to be intercepted.
   * @param {HttpHandler} next - The next handler in the chain.
   * @return {Observable<HttpEvent<any>>} The modified HTTP request with the session token added to the headers.
   */
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = window.sessionStorage.getItem('session');

    if (!token) {
      return next.handle(req);
    }

    const req1 = req.clone({
      headers: req.headers.set('Authorization', `${token}`),
    });

    return next.handle(req1);
  }
}
