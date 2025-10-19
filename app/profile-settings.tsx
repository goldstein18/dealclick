import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Linking,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { authAPI, usersAPI } from '../services/api';
import { uploadImage } from '../services/storage.service';

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
  const [whatsapp, setWhatsapp] = useState("");
  const [empresa, setEmpresa] = useState("Independiente");
  const [avatar, setAvatar] = useState<string | null>(null);
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
        setWhatsapp(user.whatsappNumber || user.phone || "");
        setEmpresa(user.company || "Independiente");
        setAvatar(user.avatar || null);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSupportWhatsApp = () => {
    const message = encodeURIComponent('Hola, necesito soporte técnico con DealClick');
    Linking.openURL(`https://wa.me/447561019183?text=${message}`);
  };

  const handleSecurityWhatsApp = () => {
    const message = encodeURIComponent('Hola, necesito ayuda con seguridad/contraseña en DealClick');
    Linking.openURL(`https://wa.me/447561019183?text=${message}`);
  };

  const handlePrivacy = () => {
    router.push('/privacy-policy');
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Eliminar Cuenta',
      '¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            // TODO: Implement delete account API endpoint
            Alert.alert('Información', 'Contacta a soporte para eliminar tu cuenta');
            handleSupportWhatsApp();
          }
        }
      ]
    );
  };

  const handleLogout = async () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que deseas cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: async () => {
            try {
              await authAPI.logout();
              router.replace('/auth/welcome');
            } catch (error) {
              console.error('Logout error:', error);
              router.replace('/auth/welcome');
            }
          }
        }
      ]
    );
  };

  const pickImage = async () => {
    try {
      // Request permissions
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permisos requeridos', 'Se necesitan permisos para acceder a la galería.');
          return;
        }
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7, // Lower quality = faster upload
        base64: false,
        exif: false, // Skip EXIF for faster processing
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setAvatar(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'No se pudo seleccionar la imagen');
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      const userData = await AsyncStorage.getItem('currentUser');
      if (!userData) {
        Alert.alert('Error', 'No se encontró información del usuario');
        return;
      }

      const user = JSON.parse(userData);
      
      console.log('Updating user profile:', user.id);

      let avatarUrl = user.avatar;

      // Upload avatar if it has changed
      if (avatar && avatar !== user.avatar) {
        try {
          console.log('Uploading new avatar...');
          
          // Get auth token
          const token = await AsyncStorage.getItem('auth_token');
          if (!token) {
            Alert.alert('Error', 'No se encontró el token de autenticación');
            return;
          }
          
          const uploadResult = await uploadImage(avatar, token);
          avatarUrl = uploadResult.medium; // Use medium size for avatar
          console.log('✅ Avatar uploaded:', avatarUrl);
        } catch (uploadError) {
          console.error('Error uploading avatar:', uploadError);
          Alert.alert('Error', 'No se pudo subir la imagen del avatar');
          return;
        }
      }

      // Update user via API
      console.log('📤 Sending profile update with avatar:', avatarUrl);
      const updatedUser = await usersAPI.update(user.id, {
        name: nombre,
        email: email,
        phone: telefono,
        whatsappNumber: whatsapp,
        company: empresa,
        avatar: avatarUrl || undefined,
      });

      console.log('✅ Profile updated successfully');
      console.log('🖼️ Updated user avatar:', updatedUser.avatar);

      // Update local storage
      await AsyncStorage.setItem('currentUser', JSON.stringify(updatedUser));
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      console.log('💾 Local storage updated');

      Alert.alert('Éxito', 'Perfil actualizado correctamente');
      router.back();
    } catch (error: any) {
      console.error('Error saving profile:', error);
      Alert.alert(
        'Error', 
        error.response?.data?.message || 'No se pudo actualizar el perfil'
      );
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

        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <Text style={styles.sectionTitle}>Foto de Perfil</Text>
          <TouchableOpacity onPress={pickImage} style={styles.avatarContainer}>
            <Image
              source={avatar ? { uri: avatar } : require('../assets/images/frontlogo.png')}
              style={styles.avatarImage}
            />
            <View style={styles.avatarEditButton}>
              <Ionicons name="camera" size={20} color="#fff" />
            </View>
          </TouchableOpacity>
          <Text style={styles.avatarHint}>Toca para cambiar tu foto de perfil</Text>
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
            <Text style={styles.label}>Empresa</Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre de tu empresa"
              value={empresa}
              onChangeText={setEmpresa}
            />
          </View>
        </View>

        {/* Contact Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información de Contacto</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="tu@email.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Teléfono</Text>
            <TextInput
              style={styles.input}
              placeholder="+52 123 456 7890"
              value={telefono}
              onChangeText={setTelefono}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>WhatsApp</Text>
            <TextInput
              style={styles.input}
              placeholder="+52 123 456 7890"
              value={whatsapp}
              onChangeText={setWhatsapp}
              keyboardType="phone-pad"
            />
          </View>
        </View>

        {/* Soporte y Ayuda */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Soporte y Ayuda</Text>
          
          <TouchableOpacity style={styles.settingItem} onPress={handleSupportWhatsApp}>
            <View style={styles.settingIconContainer}>
              <Ionicons name="help-circle-outline" size={22} color="#000" />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Soporte Técnico</Text>
              <Text style={styles.settingSubtitle}>Contacta con nosotros vía WhatsApp</Text>
            </View>
            <Ionicons name="logo-whatsapp" size={20} color="#25D366" />
          </TouchableOpacity>
        </View>

        {/* Seguridad */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Seguridad</Text>
          
          <TouchableOpacity style={styles.settingItem} onPress={handleSecurityWhatsApp}>
            <View style={styles.settingIconContainer}>
              <Ionicons name="lock-closed-outline" size={22} color="#000" />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Cambiar Contraseña</Text>
              <Text style={styles.settingSubtitle}>Solicita cambio de contraseña</Text>
            </View>
            <Ionicons name="logo-whatsapp" size={20} color="#25D366" />
          </TouchableOpacity>
        </View>

        {/* Privacidad */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Legal</Text>
          
          <TouchableOpacity style={styles.settingItem} onPress={handlePrivacy}>
            <View style={styles.settingIconContainer}>
              <Ionicons name="shield-checkmark-outline" size={22} color="#000" />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Privacidad</Text>
              <Text style={styles.settingSubtitle}>Política de privacidad</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#cfd9de" />
          </TouchableOpacity>
        </View>

        {/* Zona Peligrosa */}
        <View style={styles.section}>
          <Text style={styles.dangerSectionTitle}>Zona Peligrosa</Text>
          
          <TouchableOpacity style={styles.settingItem} onPress={handleLogout}>
            <View style={styles.settingIconContainer}>
              <Ionicons name="log-out-outline" size={22} color="#ff6b6b" />
            </View>
            <View style={styles.settingContent}>
              <Text style={[styles.settingTitle, styles.dangerText]}>Cerrar Sesión</Text>
              <Text style={styles.settingSubtitle}>Salir de tu cuenta</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#cfd9de" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem} onPress={handleDeleteAccount}>
            <View style={styles.settingIconContainer}>
              <Ionicons name="trash-outline" size={22} color="#ff3b30" />
            </View>
            <View style={styles.settingContent}>
              <Text style={[styles.settingTitle, styles.dangerText]}>Eliminar Cuenta</Text>
              <Text style={styles.settingSubtitle}>Eliminar permanentemente tu cuenta</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#cfd9de" />
          </TouchableOpacity>
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
  avatarSection: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#eff3f4',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginVertical: 16,
  },
  avatarImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  avatarEditButton: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  avatarHint: {
    fontSize: 13,
    color: '#536471',
    textAlign: 'center',
    fontFamily: 'System',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eff3f4',
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f7f9f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f1419',
    marginBottom: 2,
    fontFamily: 'System',
  },
  settingSubtitle: {
    fontSize: 13,
    color: '#536471',
    fontFamily: 'System',
  },
  dangerSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ff3b30',
    marginBottom: 16,
    fontFamily: 'System',
  },
  dangerText: {
    color: '#ff3b30',
  },
});



