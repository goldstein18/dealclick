import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

const EMPRESAS = [
  "Century 21",
  "RE/MAX",
  "Keller Williams",
  "Coldwell Banker",
  "Engel & Völkers",
  "Independiente",
  "Otra"
];

export default function ProfileSettingsScreen() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [empresa, setEmpresa] = useState("Independiente");
  const [bio, setBio] = useState("");
  const [especialidades, setEspecialidades] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      
      const userData = await AsyncStorage.getItem('currentUser');
      if (userData) {
        const user = JSON.parse(userData);
        setNombre(user.name || "");
        setEmail(user.email || "");
        setTelefono(user.phone || "");
        setEmpresa(user.company || "Independiente");
        setBio(user.bio || "");
        setEspecialidades(user.specialties || "");
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // TODO: Call API to update user profile
      console.log('Saving profile:', {
        nombre,
        email,
        telefono,
        empresa,
        bio,
        especialidades
      });

      // Update local storage
      const userData = await AsyncStorage.getItem('currentUser');
      if (userData) {
        const user = JSON.parse(userData);
        const updatedUser = {
          ...user,
          name: nombre,
          email,
          phone: telefono,
          company: empresa,
          bio,
          specialties: especialidades
        };
        await AsyncStorage.setItem('currentUser', JSON.stringify(updatedUser));
      }

      Alert.alert('Éxito', 'Perfil actualizado correctamente');
      router.back();
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'No se pudo actualizar el perfil');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Configuración de Perfil</Text>
          <TouchableOpacity 
            onPress={handleSave} 
            style={styles.saveButton}
            disabled={saving}
          >
            <Text style={styles.saveButtonText}>
              {saving ? 'Guardando...' : 'Guardar'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Personal Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información Personal</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nombre completo</Text>
            <TextInput
              style={styles.input}
              placeholder="Tu nombre"
              value={nombre}
              onChangeText={setNombre}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Biografía</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Cuéntanos sobre ti..."
              value={bio}
              onChangeText={setBio}
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Especialidades</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: Residencial, Comercial, Lujo"
              value={especialidades}
              onChangeText={setEspecialidades}
            />
          </View>
        </View>

        {/* Contact Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información de Contacto</Text>
          
          <View style={styles.contactItem}>
            <View style={styles.contactIconContainer}>
              <Ionicons name="mail" size={20} color="#fff" />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactLabel}>Email</Text>
              <TextInput
                style={styles.contactInput}
                placeholder="tu@email.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.contactItem}>
            <View style={styles.contactIconContainer}>
              <Ionicons name="call" size={20} color="#fff" />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactLabel}>Teléfono</Text>
              <TextInput
                style={styles.contactInput}
                placeholder="+52 123 456 7890"
                value={telefono}
                onChangeText={setTelefono}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          <View style={styles.contactItem}>
            <View style={styles.contactIconContainer}>
              <MaterialIcons name="business" size={20} color="#fff" />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactLabel}>Empresa</Text>
              <TextInput
                style={styles.contactInput}
                placeholder="Nombre de tu empresa"
                value={empresa}
                onChangeText={setEmpresa}
              />
            </View>
          </View>
        </View>

        {/* Suggested Companies */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Empresas Sugeridas</Text>
          <View style={styles.chipsContainer}>
            {EMPRESAS.map((emp, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.chip,
                  empresa === emp && styles.chipSelected
                ]}
                onPress={() => setEmpresa(emp)}
              >
                <Text style={[
                  styles.chipText,
                  empresa === emp && styles.chipTextSelected
                ]}>
                  {emp}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eff3f4',
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f1419',
    fontFamily: 'System',
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#000',
    borderRadius: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'System',
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#eff3f4',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f1419',
    marginBottom: 16,
    fontFamily: 'System',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f1419',
    marginBottom: 8,
    fontFamily: 'System',
  },
  input: {
    borderWidth: 1,
    borderColor: '#cfd9de',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: '#0f1419',
    fontFamily: 'System',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eff3f4',
  },
  contactIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contactInfo: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 12,
    color: '#536471',
    marginBottom: 4,
    fontFamily: 'System',
  },
  contactInput: {
    fontSize: 15,
    color: '#0f1419',
    fontWeight: '500',
    fontFamily: 'System',
    padding: 0,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f7f9f9',
    borderWidth: 1,
    borderColor: '#cfd9de',
  },
  chipSelected: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  chipText: {
    fontSize: 14,
    color: '#536471',
    fontWeight: '500',
    fontFamily: 'System',
  },
  chipTextSelected: {
    color: '#fff',
  },
  bottomSpacing: {
    height: 40,
  },
});



