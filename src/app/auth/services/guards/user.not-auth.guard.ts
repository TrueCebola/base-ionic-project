import { CanActivateFn, Router } from '@angular/router';
import { StorageService } from '../storage.service';
import { inject } from '@angular/core';

export const userNotAuthGuard: CanActivateFn = (route, state) => {
  const STORAGE = inject(StorageService);
  const ROUTER = inject(Router);
  if (STORAGE.isLoggedIn()) {
    ROUTER.navigate(['auth/login']);
    return false;
  }
  return true;
};
