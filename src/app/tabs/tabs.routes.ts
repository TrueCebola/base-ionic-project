import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { appGuard } from '../shared/guards/app.guard';

export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    // canActivate: [appGuard],
    children: [
      {
        path: 'tab1',
        // canActivate: [baseGuardGuard],
        loadComponent: () =>
          import('../tab1/tab1.page').then((m) => m.Tab1Page),
      },
      {
        path: 'tab2',
        // canActivate: [baseGuardGuard],
        loadComponent: () =>
          import('../tab2/tab2.page').then((m) => m.Tab2Page),
      },
      {
        path: 'tab3',
        // canActivate: [baseGuardGuard],
        loadComponent: () =>
          import('../tab3/tab3.page').then((m) => m.Tab3Page),
      },
      {
        path: '',
        redirectTo: '/tabs/tab1',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/tab1',
    pathMatch: 'full',
  },
];
