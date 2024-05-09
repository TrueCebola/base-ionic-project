import { Routes } from '@angular/router';
import { AuthPage } from './auth.page';
import { userNotAuthGuard } from './services/guards/user.not-auth.guard';
import { userExpiredGuard } from './services/guards/user.expired.guard';
import { userNoAccessGuard } from './services/guards/user.no-access.guard';

export const routes: Routes = [
  {
    path: '',
    component: AuthPage,
    children: [
      {
        path: 'login',
        canActivate: [userNotAuthGuard],
        loadComponent: () =>
          import('./login/login.page').then((m) => m.LoginPage),
      },
      {
        path: 'senha-expirada',
        canActivate: [userExpiredGuard],
        loadComponent: () =>
          import('./senha-expirada/senha-expirada.page').then(
            (m) => m.SenhaExpiradaPage
          ),
      },
      {
        path: 'sem-acesso',
        canActivate: [userNoAccessGuard],
        loadComponent: () =>
          import('./sem-acesso/sem-acesso.page').then((m) => m.SemAcessoPage),
      },
      {
        path: '',
        redirectTo: '/auth/login',
        pathMatch: 'full',
      },
    ],
  },
];
