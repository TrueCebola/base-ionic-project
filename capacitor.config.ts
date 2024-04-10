import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'base.project',
  appName: 'base-project',
  webDir: 'www/browser',
  server: {
    androidScheme: 'http',
    cleartext: true,
  },
};

export default config;
