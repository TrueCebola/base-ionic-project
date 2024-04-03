import { CanActivateFn } from '@angular/router';

export const userNotAuthGuard: CanActivateFn = (route, state) => {
  return true;
};
