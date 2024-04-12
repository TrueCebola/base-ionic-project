import { CanActivateFn, Router } from '@angular/router';
import { StorageService } from '../storage.service';
import { inject } from '@angular/core';

export const userExpiredGuard: CanActivateFn = (route, state) => {
  const STORAGE = inject(StorageService);
  const ROUTER = inject(Router);
  if (STORAGE.isExpired()) {
    return true;
  }
  ROUTER.navigate(['auth/senha-expirada']);
  return false;
};
