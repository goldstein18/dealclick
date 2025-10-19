import { Slot } from "expo-router";
import * as Updates from 'expo-updates';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';
import { APP_VERSION } from '../constants/version';
import { FeedProvider } from '../contexts/FeedContext';
import { API_BASE_URL } from '../services/api';
import ForceUpdateScreen from './force-update';

/**
 * Compare two semantic versions (e.g., "1.2.3" vs "1.2.4")
 * Returns: -1 if v1 < v2, 0 if equal, 1 if v1 > v2
 */
function compareVersions(v1: string, v2: string): number {
  const parts1 = v1.split('.').map(Number);
  const parts2 = v2.split('.').map(Number);
  
  for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
    const part1 = parts1[i] || 0;
    const part2 = parts2[i] || 0;
    
    if (part1 < part2) return -1;
    if (part1 > part2) return 1;
  }
  
  return 0;
}

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
        
        console.log('📱 Current app version:', APP_VERSION);
        console.log('☁️ Latest version:', versionData.currentVersion);
        console.log('⚠️ Minimum version required:', versionData.minimumVersion);
        console.log('🔒 Force update enabled:', versionData.updateRequired);
        
        // Compare versions: Check if current version is less than minimum required
        const isOutdated = compareVersions(APP_VERSION, versionData.minimumVersion) < 0;
        const forceUpdateEnabled = versionData.updateRequired;
        
        console.log('🔍 Version comparison:', {
          current: APP_VERSION,
          minimum: versionData.minimumVersion,
          isOutdated,
          shouldUpdate: forceUpdateEnabled || isOutdated
        });
        
        // Show update screen if:
        // 1. Force update is enabled from backend, OR
        // 2. User's version is lower than minimum required
        if (forceUpdateEnabled || isOutdated) {
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
