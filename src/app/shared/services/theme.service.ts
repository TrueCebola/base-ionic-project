import { Injectable, inject } from '@angular/core';
import { StorageService } from 'src/app/auth/services/storage.service';
import { enable, disable, isEnabled } from 'darkreader';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  constructor() {}

  private storageService = inject(StorageService);
  private themeOptions = {
    brightness: 100,
    contrast: 105,
    sepia: 0,
  };

  applyDark() {
    document.querySelector('body')?.classList.add('dark');
    if (isEnabled()) return;
    enable(this.themeOptions);
    this.storageService.saveTheme('dark');
  }

  removeDark() {
    document.querySelector('body')?.classList.remove('dark');
    if (!isEnabled()) return;
    disable();
    this.storageService.saveTheme('light');
  }
}
