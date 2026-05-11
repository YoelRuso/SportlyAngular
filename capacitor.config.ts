import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.sportly.app',
  appName: 'SPORTLY',
  webDir: 'dist/SPORTLY/browser',
  bundledWebRuntime: false,
  server: {
    url: 'http://10.0.2.2:8100',
    cleartext: true,
  },
};

export default config;
