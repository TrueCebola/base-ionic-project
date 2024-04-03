import { CanActivateFn } from '@angular/router';

export const userExpiredGuard: CanActivateFn = (route, state) => {
  return true;
};
