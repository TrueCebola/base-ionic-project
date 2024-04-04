import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {
    /**
     * Intercepts an HTTP request and modifies it before forwarding it to the next handler.
     *
     * @param {HttpRequest<any>} req - The HTTP request to be intercepted.
     * @param {HttpHandler} next - The next handler in the request chain.
     * @return {Observable<HttpEvent<any>>} - An observable that emits the HTTP event.
     */
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        req = req.clone({
            withCredentials: true,
        });

        return next.handle(req);
    }
}
export const httpInterceptorProviders = [
    { provide: HTTP_INTERCEPTORS, useClass: HttpRequestInterceptor, multi: true },
];