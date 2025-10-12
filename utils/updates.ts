import * as Updates from 'expo-updates';
import { Alert } from 'react-native';

export async function checkForManualUpdate() {
  try {
    if (__DEV__) {
      Alert.alert(
        'Modo desarrollo',
        'Las actualizaciones OTA no están disponibles en modo desarrollo.'
      );
      return;
    }

    const update = await Updates.checkForUpdateAsync();

    if (update.isAvailable) {
      Alert.alert(
        'Actualización disponible',
        '¿Deseas descargar e instalar la nueva versión?',
        [
          {
            text: 'Ahora no',
            style: 'cancel',
          },
          {
            text: 'Actualizar',
            onPress: async () => {
              try {
                await Updates.fetchUpdateAsync();
                Alert.alert(
                  '¡Actualización lista!',
                  'La app se reiniciará para aplicar los cambios.',
                  [
                    {
                      text: 'Reiniciar',
                      onPress: async () => {
                        await Updates.reloadAsync();
                      },
                    },
                  ]
                );
              } catch (error) {
                console.error('Error fetching update:', error);
                Alert.alert('Error', 'No se pudo descargar la actualización.');
              }
            },
          },
        ]
      );
    } else {
      Alert.alert(
        'Sin actualizaciones',
        'Ya tienes la última versión de la app.'
      );
    }
  } catch (error) {
    console.error('Error checking for updates:', error);
    Alert.alert('Error', 'No se pudo verificar actualizaciones.');
  }
}

export function getUpdateInfo() {
  return {
    updateId: Updates.updateId,
    channel: Updates.channel,
    runtimeVersion: Updates.runtimeVersion,
    createdAt: Updates.createdAt,
    isEmbeddedLaunch: Updates.isEmbeddedLaunch,
    isEmergencyLaunch: Updates.isEmergencyLaunch,
  };
}

