import { CanActivateFn, Router } from '@angular/router';
import { StorageService } from '../storage.service';
import { inject } from '@angular/core';

export const userAuthGuard: CanActivateFn = (route, state) => {
  const STORAGE = inject(StorageService);
  const ROUTER = inject(Router);
  if (STORAGE.isLoggedIn()) {
    return true;
  }
  ROUTER.navigate(['auth/login']);
  return false;
};
