import { Slot } from "expo-router";
import * as Updates from 'expo-updates';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';
import { APP_VERSION } from '../constants/version';
import { FeedProvider } from '../contexts/FeedContext';
import { API_BASE_URL } from '../services/api';
import ForceUpdateScreen from './force-update';

export default function RootLayout() {
  const [isChecking, setIsChecking] = useState(true);
  const [updateRequired, setUpdateRequired] = useState(false);
  const [updateInfo, setUpdateInfo] = useState<any>(null);

  useEffect(() => {
    async function checkVersion() {
      try {
        // Check version from backend
        const response = await fetch(`${API_BASE_URL}/version`);
        const versionData = await response.json();
        
        console.log('Current version:', APP_VERSION);
        console.log('Minimum version required:', versionData.minimumVersion);
        console.log('Update required:', versionData.updateRequired);
        
        // Check if update is required
        if (versionData.updateRequired) {
          setUpdateRequired(true);
          setUpdateInfo(versionData);
          setIsChecking(false);
          return;
        }

        // Check for OTA updates (Expo)
        if (!__DEV__) {
          try {
            const update = await Updates.checkForUpdateAsync();
            
            if (update.isAvailable) {
              await Updates.fetchUpdateAsync();
              Alert.alert(
                'Actualización disponible',
                'Se ha descargado una nueva versión. La app se reiniciará para aplicar los cambios.',
                [
                  {
                    text: 'Reiniciar ahora',
                    onPress: async () => {
                      await Updates.reloadAsync();
                    }
                  }
                ]
              );
            }
          } catch (error) {
            console.error('Error checking for OTA updates:', error);
          }
        }
      } catch (error) {
        console.error('Error checking version:', error);
        // If version check fails, continue anyway (don't block the app)
      }
      setIsChecking(false);
    }

    checkVersion();
  }, []);

  if (isChecking) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
        <Text style={styles.loadingText}>Verificando actualizaciones...</Text>
      </View>
    );
  }

  // Show force update screen if update is required
  if (updateRequired) {
    return (
      <ForceUpdateScreen 
        updateUrl={updateInfo?.updateUrl}
        message={updateInfo?.message}
      />
    );
  }

  return (
    <FeedProvider>
      <Slot />
    </FeedProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    fontFamily: 'System',
  },
});
