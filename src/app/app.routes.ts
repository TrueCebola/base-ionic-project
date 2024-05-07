import { Routes } from '@angular/router';
import { userAuthGuard } from './auth/services/guards/user.auth.guard';
import { userNotAuthGuard } from './auth/services/guards/user.not-auth.guard';

export const routes: Routes = [
  {
    path: '',
    canActivate: [userAuthGuard],
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'auth',
    canActivate: [userNotAuthGuard],
    loadChildren: () => import('./auth/auth.routes').then((m) => m.routes),
  },
];
