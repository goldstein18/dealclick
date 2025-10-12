import { Slot } from "expo-router";
import * as Updates from 'expo-updates';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';
import { FeedProvider } from '../contexts/FeedContext';

export default function RootLayout() {
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    async function checkForUpdates() {
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
          console.error('Error checking for updates:', error);
        }
      }
      setIsChecking(false);
    }

    checkForUpdates();
  }, []);

  if (isChecking) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
        <Text style={styles.loadingText}>Verificando actualizaciones...</Text>
      </View>
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
