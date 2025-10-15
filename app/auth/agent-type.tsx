import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { authAPI } from '../../services/api';

const PROPERTY_TYPES = [
  { id: 'casas', name: 'Casas', icon: 'home', description: 'Propiedades residenciales' },
  { id: 'comerciales', name: 'Comerciales', icon: 'business', description: 'Oficinas y locales' },
  { id: 'renta', name: 'Renta', icon: 'key', description: 'Propiedades en renta' },
];

const REGIONS = [
  'Ciudad de México',
  'Guadalajara',
  'Monterrey',
  'Puebla',
  'Querétaro',
  'Mérida',
  'Tijuana',
  'Cancún',
  'Otra',
];

export default function AgentTypeScreen() {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedRegion, setSelectedRegion] = useState('');
  const [showRegionDropdown, setShowRegionDropdown] = useState(false);
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

      // Create account (specialties will be added later via profile update)
      console.log('Creating account for:', signupData.email);
      
      const response = await authAPI.register({
        email: signupData.email,
        password: signupData.password,
        name: signupData.name,
        userHandle: signupData.email.split('@')[0],
        phone: signupData.phone || undefined,
        whatsappNumber: signupData.phone || undefined,
        company: signupData.company || 'Independiente',
        ubicacion: selectedRegion,
        specialties: selectedTypes.join(', '),
        bio: `Agente inmobiliario especializado en ${selectedTypes.map(t => PROPERTY_TYPES.find(pt => pt.id === t)?.name).join(', ')}. Ubicado en ${selectedRegion}.`,
      });

      console.log('✅ Account created successfully with all data');

      // Save auth data
      await AsyncStorage.setItem('auth_token', response.access_token);
      await AsyncStorage.setItem('user', JSON.stringify(response.user));
      await AsyncStorage.setItem('currentUser', JSON.stringify(response.user));

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

          {/* Region Selection */}
          <View style={styles.regionContainer}>
            <Text style={styles.regionLabel}>Zona principal</Text>
            <TouchableOpacity 
              style={styles.regionDropdown}
              onPress={() => setShowRegionDropdown(!showRegionDropdown)}
            >
              <Text style={[
                styles.regionText,
                !selectedRegion && styles.regionPlaceholder
              ]}>
                {selectedRegion || 'Selecciona tu zona'}
              </Text>
              <Ionicons 
                name={showRegionDropdown ? "chevron-up" : "chevron-down"} 
                size={20} 
                color="#666" 
              />
            </TouchableOpacity>

            {/* Dropdown */}
            {showRegionDropdown && (
              <View style={styles.dropdownContainer}>
                {REGIONS.map((region) => (
                  <TouchableOpacity
                    key={region}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setSelectedRegion(region);
                      setShowRegionDropdown(false);
                    }}
                  >
                    <Text style={styles.dropdownItemText}>{region}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
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
    marginBottom: 8,
  },
  regionDropdown: {
    borderWidth: 1,
    borderColor: '#e1e5e9',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#f8f9fa',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  regionText: {
    fontSize: 16,
    color: '#333',
  },
  regionPlaceholder: {
    color: '#999',
  },
  dropdownContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e1e5e9',
    borderRadius: 12,
    marginTop: 4,
    maxHeight: 200,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#333',
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