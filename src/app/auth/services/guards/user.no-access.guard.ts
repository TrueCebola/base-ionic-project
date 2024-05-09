import { CanActivateFn, Router } from '@angular/router';
import { StorageService } from '../storage.service';
import { inject } from '@angular/core';

export const userNoAccessGuard: CanActivateFn = (route, state) => {
  const STORAGE = inject(StorageService);
  const ROUTER = inject(Router);
  if (STORAGE.isDenied()) {
    return true;
  }
  ROUTER.navigate(['auth/sem-acesso']);
  return false;
};
