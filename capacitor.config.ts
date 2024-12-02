import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.senrevision.app',  // io.ionic.starter
  appName: 'Jangalma',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    AdMob: {
      appId: {
        android: 'ca-app-pub-8580211937730370~5954761573', // Remplacez par votre App ID Android
        ios: 'ca-app-pub-8580211937730370~5483908071',     // Remplacez par votre App ID iOS
      },
      testDeviceIds: ['YOUR_TEST_DEVICE_ID'],
    },
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert']
    }
  }
};

export default config;
