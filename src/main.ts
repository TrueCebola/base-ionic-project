import { enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter } from '@angular/router';
import {
  IonicRouteStrategy,
  provideIonicAngular,
} from '@ionic/angular/standalone';
import { PoStorageService } from '@po-ui/ng-storage';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';
import { provideHttpClient } from '@angular/common/http';
import { PoModule, PoServicesModule } from '@po-ui/ng-components';
import { AuthInterceptor } from './app/helpers/auth.interceptor';
import {
  httpInterceptorProviders,
  HttpRequestInterceptor,
} from './app/helpers/http.interceptor';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes),
    provideHttpClient(),
    { provide: PoModule },
    { provide: PoServicesModule },
    { provide: AuthInterceptor },
    { provide: HttpRequestInterceptor },
    { provide: httpInterceptorProviders, useValue: httpInterceptorProviders },
    {
      provide: PoStorageService,
      useValue: PoStorageService.providePoStorage(),
    },
  ],
});
