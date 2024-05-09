import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

/**
 * Checks if the user is an admin by making an API request to the server.
 *
 * @param {Route} route - The route object.
 * @param {State} state - The state object.
 * @return {boolean} - Returns a boolean indicating if the user is an admin or not.
 */
export const appGuard: CanActivateFn = (route, state) => {
  let data: any = jwtDecode(window.sessionStorage.getItem('session')!);
  const ROUTER: Router = inject(Router);
  if (data) {
    let role = data.permissions.find(
      (permission: any) => permission.app === 'App'
    );
    if (role) {
      return true;
    }
    ROUTER.navigate(['auth/sem-acesso']);
  }
  return false;
};
