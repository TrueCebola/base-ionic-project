import { CanActivateFn } from '@angular/router';

export const userAuthGuard: CanActivateFn = (route, state) => {
  return true;
};
