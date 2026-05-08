import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'ai.likeone.academy',
  appName: 'LO Academy',
  webDir: 'out',
  server: {
    url: 'https://likeone.ai',
    cleartext: false,
  },
  ios: {
    scheme: 'LO Academy',
    contentInset: 'always',
    preferredContentMode: 'mobile',
    backgroundColor: '#1a1a1e',
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: true,
      backgroundColor: '#1a1a1e',
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#1a1a1e',
    },
  },
};

export default config;
