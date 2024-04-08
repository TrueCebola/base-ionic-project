import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'base.project',
  appName: 'base-project',
  loggingBehavior: 'production',
  webDir: 'www/browser',
  server: {
    androidScheme: 'siaadesv.cambuhy.com.br',
    cleartext: true,
  },
};

export default config;
