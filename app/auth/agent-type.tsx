import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { authAPI, usersAPI } from '../../services/api';
import { uploadImage } from '../../services/storage.service';

const PROPERTY_TYPES = [
  { id: 'casas', name: 'Casas', icon: 'home', description: 'Propiedades residenciales' },
  { id: 'comerciales', name: 'Comerciales', icon: 'business', description: 'Oficinas y locales' },
  { id: 'renta', name: 'Renta', icon: 'key', description: 'Propiedades en renta' },
];

const ESTADOS = [
  'Aguascalientes',
  'Baja California',
  'Baja California Sur',
  'Campeche',
  'Chiapas',
  'Chihuahua',
  'Ciudad de México',
  'Coahuila',
  'Colima',
  'Durango',
  'Estado de México',
  'Guanajuato',
  'Guerrero',
  'Hidalgo',
  'Jalisco',
  'Michoacán',
  'Morelos',
  'Nayarit',
  'Nuevo León',
  'Oaxaca',
  'Puebla',
  'Querétaro',
  'Quintana Roo',
  'San Luis Potosí',
  'Sinaloa',
  'Sonora',
  'Tabasco',
  'Tamaulipas',
  'Tlaxcala',
  'Veracruz',
  'Yucatán',
  'Zacatecas',
];

export default function AgentTypeScreen() {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedRegion, setSelectedRegion] = useState('');
  const [loading, setLoading] = useState(false);

  const togglePropertyType = (typeId: string) => {
    if (selectedTypes.includes(typeId)) {
      setSelectedTypes(selectedTypes.filter(id => id !== typeId));
    } else {
      setSelectedTypes([...selectedTypes, typeId]);
    }
  };

  const handleContinue = async () => {
    if (selectedTypes.length === 0) {
      Alert.alert('Error', 'Por favor selecciona al menos un tipo de propiedad');
      return;
    }

    if (!selectedRegion) {
      Alert.alert('Error', 'Por favor selecciona tu zona principal');
      return;
    }

    try {
      setLoading(true);

      // Get all signup data
      const signupDataStr = await AsyncStorage.getItem('signup_data');
      if (!signupDataStr) {
        Alert.alert('Error', 'Datos de registro no encontrados');
        router.replace('/auth/create-account');
        return;
      }

      const signupData = JSON.parse(signupDataStr);

      // Create account via API
      console.log('Creating account with data:', {
        email: signupData.email,
        name: signupData.name,
        city: signupData.city,
        company: signupData.company,
        propertyTypes: selectedTypes,
        region: selectedRegion
      });

      // Step 1: Create account first (without avatar)
      console.log('Creating account for:', signupData.email);
      
      const response = await authAPI.register({
        email: signupData.email,
        password: signupData.password,
        name: signupData.name,
        userHandle: signupData.email.split('@')[0],
        phone: signupData.phone,
        whatsappNumber: signupData.whatsapp || signupData.phone,
        company: signupData.company || 'Independiente',
        ubicacion: selectedRegion,
        specialties: selectedTypes.join(', '),
        bio: `Agente inmobiliario especializado en ${selectedTypes.map(t => PROPERTY_TYPES.find(pt => pt.id === t)?.name).join(', ')}. Ubicado en ${selectedRegion}.`,
      });

      console.log('✅ Account created successfully');

      // Save auth token (needed for uploading avatar)
      await AsyncStorage.setItem('auth_token', response.access_token);
      await AsyncStorage.setItem('user', JSON.stringify(response.user));
      
      // Clear any old biometric credentials to prevent auto-login with wrong account
      await AsyncStorage.removeItem('biometric_email');
      await AsyncStorage.removeItem('biometric_password');
      
      // Step 2: Upload avatar if provided (now we have a token)
      let finalUser = response.user;
      
      if (signupData.avatar) {
        try {
          console.log('Uploading avatar image...');
          const uploadResult = await uploadImage(signupData.avatar, response.access_token);
          const avatarUrl = uploadResult.medium;
          console.log('✅ Avatar uploaded:', avatarUrl);
          
          // Step 3: Update user with avatar URL
          const updatedUser = await usersAPI.update(response.user.id, {
            avatar: avatarUrl,
          });
          
          finalUser = updatedUser;
          console.log('✅ Avatar updated in profile');
        } catch (avatarError) {
          console.error('Error with avatar, skipping:', avatarError);
          // Continue without avatar if upload fails
        }
      }

      // Save final user data with avatar
      await AsyncStorage.setItem('currentUser', JSON.stringify(finalUser));

      // Clear signup data
      await AsyncStorage.removeItem('signup_data');

      Alert.alert(
        '¡Bienvenido!',
        'Tu cuenta ha sido creada exitosamente',
        [
          {
            text: 'Comenzar',
            onPress: () => router.replace('/(tabs)')
          }
        ]
      );
    } catch (error: any) {
      console.error('Error creating account:', error);
      Alert.alert(
        'Error',
        error.response?.data?.message || 'No se pudo crear la cuenta. Por favor intenta de nuevo.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tipo de agente</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.title}>¿Qué manejas?</Text>
          <Text style={styles.subtitle}>
            Selecciona los tipos de propiedades que manejas
          </Text>

          {/* Property Types */}
          <View style={styles.propertyTypesContainer}>
            {PROPERTY_TYPES.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.propertyTypeCard,
                  selectedTypes.includes(type.id) && styles.propertyTypeCardSelected
                ]}
                onPress={() => togglePropertyType(type.id)}
              >
                <View style={styles.propertyTypeIcon}>
                  <Ionicons 
                    name={type.icon as any} 
                    size={32} 
                    color={selectedTypes.includes(type.id) ? '#fff' : '#000'} 
                  />
                </View>
                <Text style={[
                  styles.propertyTypeName,
                  selectedTypes.includes(type.id) && styles.propertyTypeNameSelected
                ]}>
                  {type.name}
                </Text>
                <Text style={[
                  styles.propertyTypeDescription,
                  selectedTypes.includes(type.id) && styles.propertyTypeDescriptionSelected
                ]}>
                  {type.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Estado Selection */}
          <View style={styles.regionContainer}>
            <Text style={styles.regionLabel}>Estado</Text>
            <View style={styles.regionsWrapper}>
              {ESTADOS.map((estado) => (
                <TouchableOpacity
                  key={estado}
                  style={[
                    styles.regionChip,
                    selectedRegion === estado && styles.regionChipSelected
                  ]}
                  onPress={() => setSelectedRegion(estado)}
                >
                  <Text style={[
                    styles.regionChipText,
                    selectedRegion === estado && styles.regionChipTextSelected
                  ]}>
                    {estado}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Continue Button */}
          <TouchableOpacity 
            style={[
              styles.continueButton, 
              selectedTypes.length > 0 && selectedRegion && !loading && styles.continueButtonActive
            ]} 
            onPress={handleContinue}
            disabled={selectedTypes.length === 0 || !selectedRegion || loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.continueButtonText}>Finalizar</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 24,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  placeholder: {
    width: 40,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  content: {
    flex: 1,
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
    lineHeight: 24,
  },
  propertyTypesContainer: {
    marginBottom: 40,
  },
  propertyTypeCard: {
    borderWidth: 2,
    borderColor: '#e1e5e9',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
  },
  propertyTypeCardSelected: {
    borderColor: '#000',
    backgroundColor: '#000',
  },
  propertyTypeIcon: {
    marginBottom: 12,
  },
  propertyTypeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  propertyTypeNameSelected: {
    color: '#fff',
  },
  propertyTypeDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  propertyTypeDescriptionSelected: {
    color: '#fff',
    opacity: 0.9,
  },
  regionContainer: {
    marginBottom: 40,
  },
  regionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  regionsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  regionChip: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#e1e5e9',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  regionChipSelected: {
    backgroundColor: '#000',
    borderColor: '#000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
    transform: [{ scale: 1.02 }],
  },
  regionChipText: {
    fontSize: 15,
    color: '#666',
    fontWeight: '600',
    fontFamily: 'System',
  },
  regionChipTextSelected: {
    color: '#fff',
    fontWeight: '700',
  },
  continueButton: {
    backgroundColor: '#e1e5e9',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  continueButtonActive: {
    backgroundColor: '#000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
}); 