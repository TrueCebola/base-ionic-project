import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'rh.listas.presencas',
  appName: 'rh-listas-presencas',
  webDir: 'www/browser',
  server: {
    androidScheme: 'https',
    cleartext: true,
    hostname: 'siaadesv.cambuhy.com.br',
  },
};

export default config;
