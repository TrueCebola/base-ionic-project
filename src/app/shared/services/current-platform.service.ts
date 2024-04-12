import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';

type CurrentPlatform = 'browser' | 'hybrid';

@Injectable({
  providedIn: 'root',
})
export class CurrentPlatformService {
  constructor(private platform: Platform) {
    this.setCurrentPlatform();
  }

  private currentPlatform!: CurrentPlatform;

  getCurrentPlatform(): CurrentPlatform {
    return this.currentPlatform;
  }

  isHybrid() {
    return this.currentPlatform === 'hybrid';
  }

  isBrowser() {
    return this.currentPlatform === 'browser';
  }

  private setCurrentPlatform() {
    if (this.platform.is('hybrid')) {
      this.currentPlatform = 'hybrid';
    } else {
      this.currentPlatform = 'browser';
    }
  }
}
