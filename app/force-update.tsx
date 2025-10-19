import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

interface ForceUpdateScreenProps {
  updateUrl?: string;
  message?: string;
}

export default function ForceUpdateScreen({ 
  message = 'Hay una nueva versión disponible con mejoras importantes.'
}: ForceUpdateScreenProps) {

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
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#000',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'System',
  },
  message: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 26,
    fontFamily: 'System',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
    fontFamily: 'System',
  },
  footerText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
    fontFamily: 'System',
  },
});

