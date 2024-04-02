import { Routes } from '@angular/router';
import { AuthPage } from './auth.page';

export const routes: Routes = [
  {
    path: '',
    component: AuthPage,
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./login/login.page').then((m) => m.LoginPage),
      },
      {
        path: 'senha-expirada',
        loadComponent: () =>
          import('./senha-expirada/senha-expirada.page').then(
            (m) => m.SenhaExpiradaPage
          ),
      },
      {
        path: '',
        redirectTo: '/auth/login',
        pathMatch: 'full',
      },
    ],
  },
];
