import Constants from 'expo-constants';

// Get version from app.json
export const APP_VERSION = Constants.expoConfig?.version || '1.0.0';
export const BUILD_NUMBER = Constants.expoConfig?.ios?.buildNumber || Constants.expoConfig?.android?.versionCode || '1';

// For debugging
export const VERSION_INFO = {
  version: APP_VERSION,
  buildNumber: BUILD_NUMBER,
  nativeVersion: Constants.nativeBuildVersion,
  nativeAppVersion: Constants.nativeAppVersion,
};

