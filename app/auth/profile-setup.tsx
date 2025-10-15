import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function ProfileSetupScreen() {
  const [fullName, setFullName] = useState('');
  const [city, setCity] = useState('');
  const [agency, setAgency] = useState('');
  const [phone, setPhone] = useState('');
  const [yearsExperience, setYearsExperience] = useState('');
  
  // Calculate default date (25 years old) and max date (18 years ago)
  const getDefaultDate = () => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 25);
    return date;
  };
  
  const getMaxDate = () => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 18);
    return date;
  };
  
  const [birthDate, setBirthDate] = useState(getDefaultDate());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleContinue = async () => {
    if (!fullName.trim()) {
      Alert.alert('Error', 'Por favor ingresa tu nombre completo');
      return;
    }

    if (!city.trim()) {
      Alert.alert('Error', 'Por favor ingresa tu ciudad');
      return;
    }

    if (!yearsExperience.trim()) {
      Alert.alert('Error', 'Por favor ingresa tus años de experiencia');
      return;
    }

    // Get existing signup data
    const signupDataStr = await AsyncStorage.getItem('signup_data');
    if (!signupDataStr) {
      Alert.alert('Error', 'Datos de registro no encontrados');
      router.replace('/auth/create-account');
      return;
    }

    const signupData = JSON.parse(signupDataStr);

    // Add profile data
    await AsyncStorage.setItem('signup_data', JSON.stringify({
      ...signupData,
      name: fullName.trim(),
      city: city.trim(),
      company: agency.trim() || 'Independiente',
      phone: phone.trim() || undefined,
      experience: yearsExperience.trim(),
      birthDate: birthDate.toISOString()
    }));

    // Navigate to upload photo screen
    router.push('/auth/upload-photo');
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (selectedDate) {
      // Validate minimum age (18 years)
      const maxDate = getMaxDate();
      if (selectedDate > maxDate) {
        Alert.alert('Error', 'Debes tener al menos 18 años para registrarte');
        return;
      }
      setBirthDate(selectedDate);
    }
  };
  
  const handleDatePickerDone = () => {
    setShowDatePicker(false);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Configurar perfil</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Text style={styles.title}>Configura tu perfil</Text>
          <Text style={styles.subtitle}>Cuéntanos más sobre ti</Text>

          {/* Full Name Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nombre completo</Text>
            <TextInput
              style={styles.input}
              placeholder="Tu nombre completo"
              value={fullName}
              onChangeText={setFullName}
              autoCapitalize="words"
            />
          </View>

          {/* City Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Ciudad</Text>
            <TextInput
              style={styles.input}
              placeholder="Tu ciudad"
              value={city}
              onChangeText={setCity}
              autoCapitalize="words"
            />
          </View>

          {/* Agency Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Inmobiliaria (opcional)</Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre de tu inmobiliaria"
              value={agency}
              onChangeText={setAgency}
              autoCapitalize="words"
            />
          </View>

          {/* Phone Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Teléfono (opcional)</Text>
            <TextInput
              style={styles.input}
              placeholder="+52 123 456 7890"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>

          {/* Years of Experience Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Años de experiencia</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: 5"
              value={yearsExperience}
              onChangeText={setYearsExperience}
              keyboardType="numeric"
            />
          </View>

          {/* Birth Date Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Fecha de nacimiento</Text>
            <TouchableOpacity 
              style={styles.dateInput}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateText}>{formatDate(birthDate)}</Text>
              <Ionicons name="calendar" size={20} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Continue Button */}
          <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
            <Text style={styles.continueButtonText}>Continuar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Date Picker Modal for iOS */}
      {Platform.OS === 'ios' ? (
        <Modal
          visible={showDatePicker}
          transparent={true}
          animationType="slide"
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Fecha de nacimiento</Text>
                <Text style={styles.modalSubtitle}>Debes tener al menos 18 años</Text>
              </View>
              
              <DateTimePicker
                value={birthDate}
                mode="date"
                display="spinner"
                onChange={handleDateChange}
                maximumDate={getMaxDate()}
                minimumDate={new Date(1940, 0, 1)}
                textColor="#000"
                locale="es-ES"
              />
              
              <TouchableOpacity 
                style={styles.modalButton}
                onPress={handleDatePickerDone}
              >
                <Text style={styles.modalButtonText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      ) : (
        showDatePicker && (
          <DateTimePicker
            value={birthDate}
            mode="date"
            display="default"
            onChange={handleDateChange}
            maximumDate={getMaxDate()}
            minimumDate={new Date(1940, 0, 1)}
          />
        )
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: 20,
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
  form: {
    flex: 1,
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e1e5e9',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
  },
  dateInput: {
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
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  continueButton: {
    backgroundColor: '#000',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 32,
    marginBottom: 24,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  modalHeader: {
    paddingTop: 24,
    paddingHorizontal: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  modalButton: {
    backgroundColor: '#000',
    marginHorizontal: 24,
    marginTop: 16,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
}); 