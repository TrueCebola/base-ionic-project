import { CanActivateFn, Router } from '@angular/router';
import { StorageService } from '../storage.service';
import { inject } from '@angular/core';

export const userNotAuthGuard: CanActivateFn = (route, state) => {
  const STORAGE = inject(StorageService);
  const ROUTER = inject(Router);
  if (STORAGE.isLoggedIn()) {
    ROUTER.navigate(['tabs/tab1']);
    return false;
  }
  return true;
};
