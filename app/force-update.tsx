import { Ionicons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import React from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ForceUpdateScreenProps {
  updateUrl?: string;
  message?: string;
}

export default function ForceUpdateScreen({ 
  updateUrl = 'https://dealclick.app/download',
  message = 'Hay una nueva versión disponible con mejoras importantes.'
}: ForceUpdateScreenProps) {
  const handleUpdate = () => {
    const url = Platform.select({
      ios: 'https://apps.apple.com/app/dealclick/id123456789', // Update with real App Store URL
      android: 'https://play.google.com/store/apps/details?id=com.dealclick', // Update with real Play Store URL
      default: updateUrl,
    });
    
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <View style={styles.logoSection}>
        <Image 
          source={require('../assets/images/frontlogo.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Icon */}
      <View style={styles.iconContainer}>
        <Ionicons name="cloud-download-outline" size={80} color="#000" />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>Actualización Requerida</Text>
        <Text style={styles.message}>{message}</Text>
        <Text style={styles.subtitle}>
          Por favor actualiza a la última versión para continuar usando DealClick.
        </Text>
      </View>

      {/* Update Button */}
      <View style={styles.buttonSection}>
        <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
          <Ionicons name="download-outline" size={24} color="#fff" />
          <Text style={styles.updateButtonText}>Actualizar Ahora</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>
          Esta actualización es necesaria para garantizar el mejor funcionamiento de la app.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
  },
  logoSection: {
    alignItems: 'center',
    paddingTop: 80,
    paddingBottom: 40,
  },
  logo: {
    width: 120,
    height: 120,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  content: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#000',
    textAlign: 'center',
    marginBottom: 16,
    fontFamily: 'System',
  },
  message: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 24,
    fontFamily: 'System',
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
    fontFamily: 'System',
  },
  buttonSection: {
    paddingBottom: 40,
  },
  updateButton: {
    flexDirection: 'row',
    backgroundColor: '#000',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    marginBottom: 20,
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'System',
  },
  footerText: {
    fontSize: 13,
    color: '#999',
    textAlign: 'center',
    lineHeight: 18,
    fontFamily: 'System',
  },
});

