import { CanActivateFn } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

/**
 * Validates if the current user has the necessary permissions to access the "Programa" feature.
 *
 * @param {any} route - The route object.
 * @param {any} state - The state object.
 * @return {boolean} Returns true if the user has the necessary permissions, false otherwise.
 */
export const baseGuardGuard: CanActivateFn = (route, state) => {
  let url = state.url;
  let data: any = jwtDecode(window.sessionStorage.getItem('session')!);
  let role;
  if (data) {
    if (url.includes('Cadastro')) {
      if (url.includes('?id=')) {
        role = data.permissions.find(
          (permission: any) =>
            permission.app === 'App' &&
            permission.name === 'Programa' &&
            permission.update
        );
        if (role) {
          return true;
        }
      } else {
        role = data.permissions.find(
          (permission: any) =>
            permission.app === 'App' &&
            permission.name === 'Programa' &&
            permission.create
        );
        if (role) {
          return true;
        }
      }
      return false;
    } else {
      role = data.permissions.find(
        (permission: any) =>
          permission.app === 'App' &&
          permission.name === 'Programa' &&
          permission.read
      );
      if (role) {
        return true;
      }
    }
    return false;
  }
  return false;
};
