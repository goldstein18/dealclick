import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from "react";
import { Animated, Dimensions, FlatList, Image, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

const { width } = Dimensions.get('window');

const EMPRESAS = [
  "Century 21",
  "RE/MAX",
  "Keller Williams",
  "Coldwell Banker",
  "Engel & Völkers",
  "Otra"
];

const propiedadesSimuladas = [
  { id: '1', imagen: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80', precio: '$2,500,000' },
  { id: '2', imagen: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80', precio: '$1,800,000' },
  { id: '3', imagen: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=400&q=80', precio: '$3,200,000' },
];

export default function ProfileScreen() {
  const [image, setImage] = useState<string | null>('https://i.pravatar.cc/200?img=1');
  const [nombre, setNombre] = useState("María González");
  const [bio, setBio] = useState("Especialista en bienes raíces con más de 10 años de experiencia. Apasionada por encontrar la propiedad perfecta para cada cliente.");
  const [especialidades, setEspecialidades] = useState("Residencial, Comercial");
  const [email, setEmail] = useState("maria.gonzalez@agentclick.com");
  const [telefono, setTelefono] = useState("+52 55 1234 5678");
  const [empresa, setEmpresa] = useState(EMPRESAS[0]);
  const [editando, setEditando] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(1));

  const pickImage = async () => {
    if (Platform.OS !== "web") {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Se requieren permisos para acceder a la galería.");
        return;
      }
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSave = () => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0.5,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
    
    setEditando(false);
    alert("Perfil guardado correctamente");
  };


  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Modern Header with Glassmorphism */}
      <View style={styles.headerContainer}>
        <LinearGradient
          colors={['#000', '#1a1a1a', '#2d2d2d']}
          style={styles.headerGradient}
        >
          <View style={styles.headerContent}>
            <View style={styles.headerTop}>
              <View style={styles.headerTitleContainer}>
                <Text style={styles.headerTitle}>Mi Perfil</Text>
                <View style={styles.statusIndicator}>
                  <View style={styles.statusDot} />
                  <Text style={styles.statusText}>Activo</Text>
                </View>
              </View>
              <View style={styles.headerButtons}>
                <TouchableOpacity 
                  style={styles.settingsButton} 
                  onPress={() => router.push('/screens/settings')}
                >
                  <Ionicons name="settings-outline" size={18} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.editButton} onPress={() => setEditando(!editando)}>
                  <Ionicons name={editando ? "checkmark" : "create-outline"} size={18} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.profileSection}>
              <TouchableOpacity onPress={pickImage} style={styles.avatarContainer}>
                <View style={styles.avatarGlow} />
                <Image
                  source={{ uri: image! }}
                  style={styles.avatar}
                  onError={(error) => console.log('Image load error:', error)}
                  onLoad={() => console.log('Image loaded successfully')}
                />
                <View style={styles.editAvatarButton}>
                  <Ionicons name="camera" size={12} color="#fff" />
                </View>
              </TouchableOpacity>
              
              <View style={styles.profileInfo}>
                <Text style={styles.nombre}>{nombre}</Text>
                <View style={styles.empresaContainer}>
                  <Ionicons name="business" size={14} color="rgba(255, 255, 255, 0.8)" />
                  <Text style={styles.empresa}>{empresa}</Text>
                </View>
              </View>
            </View>
          </View>
        </LinearGradient>
        
      </View>


      {/* Modern Bio Section */}
      <View style={styles.modernSection}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionIconContainer}>
            <Ionicons name="person-circle" size={24} color="#000" />
          </View>
          <View style={styles.sectionTitleContainer}>
            <Text style={styles.sectionTitle}>Sobre mí</Text>
            <Text style={styles.sectionSubtitle}>Mi experiencia profesional</Text>
          </View>
        </View>
        
        <View style={styles.bioContainer}>
          <Text style={styles.bio}>{bio}</Text>
        </View>
        
        <View style={styles.specialtiesSection}>
          <View style={styles.specialtiesHeader}>
            <Ionicons name="star" size={16} color="#000" />
            <Text style={styles.specialtiesTitle}>Especialidades</Text>
          </View>
          <View style={styles.chipsContainer}>
            {especialidades.split(',').map((esp, idx) => (
              <View key={idx} style={styles.modernChip}>
                <Ionicons name="checkmark-circle" size={14} color="#000" />
                <Text style={styles.chipText}>{esp.trim()}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Modern Contact Section */}
      <View style={styles.modernSection}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionIconContainer}>
            <Ionicons name="call" size={24} color="#000" />
          </View>
          <View style={styles.sectionTitleContainer}>
            <Text style={styles.sectionTitle}>Contacto</Text>
            <Text style={styles.sectionSubtitle}>Información de contacto</Text>
          </View>
        </View>
        
        <View style={styles.contactContainer}>
          <TouchableOpacity style={styles.modernContactItem}>
            <View style={styles.contactIconContainer}>
              <Ionicons name="mail" size={20} color="#fff" />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactLabel}>Email</Text>
              <Text style={styles.contactValue}>{email}</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#000" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.modernContactItem}>
            <View style={styles.contactIconContainer}>
              <Ionicons name="call" size={20} color="#fff" />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactLabel}>Teléfono</Text>
              <Text style={styles.contactValue}>{telefono}</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#000" />
          </TouchableOpacity>

          <View style={styles.modernContactItem}>
            <View style={styles.contactIconContainer}>
              <MaterialIcons name="business" size={20} color="#fff" />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactLabel}>Empresa</Text>
              <Text style={styles.contactValue}>{empresa}</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#000" />
          </View>
        </View>
      </View>

      {/* Edit Form */}
      {editando && (
        <Animated.View style={[styles.editForm, { opacity: fadeAnim }]}>
          <Text style={styles.formTitle}>Editar perfil</Text>
          <TextInput
            style={styles.input}
            placeholder="Nombre completo"
            value={nombre}
            onChangeText={setNombre}
          />
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Biografía"
            value={bio}
            onChangeText={setBio}
            multiline
            numberOfLines={4}
          />
          <TextInput
            style={styles.input}
            placeholder="Especialidades (separadas por coma)"
            value={especialidades}
            onChangeText={setEspecialidades}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Teléfono"
            value={telefono}
            onChangeText={setTelefono}
            keyboardType="phone-pad"
          />
          
          <Text style={styles.inputLabel}>Empresa inmobiliaria</Text>
          <View style={styles.empresaOptions}>
            {EMPRESAS.map((e) => (
              <TouchableOpacity
                key={e}
                style={[
                  styles.empresaOption,
                  empresa === e && styles.empresaOptionSelected
                ]}
                onPress={() => setEmpresa(e)}
              >
                <Text style={[
                  styles.empresaOptionText,
                  empresa === e && styles.empresaOptionTextSelected
                ]}>{e}</Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Guardar cambios</Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* Modern Properties Section */}
      <View style={styles.modernSection}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionIconContainer}>
            <Ionicons name="home" size={24} color="#000" />
          </View>
          <View style={styles.sectionTitleContainer}>
            <Text style={styles.sectionTitle}>Mis propiedades</Text>
            <Text style={styles.sectionSubtitle}>Portfolio destacado</Text>
          </View>
          <TouchableOpacity style={styles.viewAllButton}>
            <Text style={styles.viewAllText}>Ver todas</Text>
            <Ionicons name="chevron-forward" size={16} color="#000" />
          </TouchableOpacity>
        </View>
        
        <FlatList
          data={propiedadesSimuladas}
          keyExtractor={item => item.id}
          numColumns={2}
          scrollEnabled={false}
          contentContainerStyle={styles.propertiesGrid}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.modernPropertyCard}>
              <View style={styles.propertyImageContainer}>
                <Image source={{ uri: item.imagen }} style={styles.propertyImage} />
                <View style={styles.propertyOverlay}>
                  <View style={styles.propertyStatusBadge}>
                    <View style={styles.statusDot} />
                    <Text style={styles.statusText}>Disponible</Text>
                  </View>
                </View>
              </View>
              <View style={styles.propertyInfo}>
                <Text style={styles.propertyPrice}>{item.precio}</Text>
                <Text style={styles.propertyLocation}>Las Condes, Santiago</Text>
                <View style={styles.propertyFeatures}>
                  <View style={styles.featureItem}>
                    <Ionicons name="bed" size={12} color="#666" />
                    <Text style={styles.featureText}>3 hab</Text>
                  </View>
                  <View style={styles.featureItem}>
                    <Ionicons name="water" size={12} color="#666" />
                    <Text style={styles.featureText}>2 baños</Text>
                  </View>
                  <View style={styles.featureItem}>
                    <Ionicons name="resize" size={12} color="#666" />
                    <Text style={styles.featureText}>120m²</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  headerContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  headerContent: {
    flex: 1,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 4,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileInfo: {
    flex: 1,
    marginLeft: 20,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatarGlow: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    top: -5,
    left: -5,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: '#fff',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  nombre: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 6,
  },
  empresaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  empresa: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginLeft: 4,
    fontWeight: '500',
  },
  modernSection: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  sectionTitleContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 2,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  bioContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  specialtiesSection: {
    marginTop: 4,
  },
  specialtiesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  specialtiesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 6,
  },
  bio: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: '#f0f8ff',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#000',
  },
  modernChip: {
    backgroundColor: '#f0f8ff',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#000',
    flexDirection: 'row',
    alignItems: 'center',
  },
  chipText: {
    color: '#000',
    fontWeight: '600',
    fontSize: 13,
    marginLeft: 6,
  },
  contactContainer: {
    gap: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e1e5e9',
  },
  modernContactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e1e5e9',
  },
  contactIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f0f8ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contactIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  contactInfo: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  editForm: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e1e5e9',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
    marginBottom: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  empresaOptions: {
    marginBottom: 20,
  },
  empresaOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e1e5e9',
  },
  empresaOptionSelected: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  empresaOptionText: {
    fontSize: 16,
    color: '#333',
  },
  empresaOptionTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#000',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 14,
    color: '#000',
    fontWeight: '600',
    marginRight: 4,
  },
  propertiesGrid: {
    gap: 12,
  },
  propertyCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginHorizontal: 6,
  },
  modernPropertyCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginHorizontal: 6,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  propertyImageContainer: {
    position: 'relative',
  },
  propertyImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  propertyOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  propertyStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(76, 175, 80, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  propertyInfo: {
    padding: 16,
  },
  propertyPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: '#000',
    marginBottom: 4,
  },
  propertyLocation: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
    fontWeight: '500',
  },
  propertyFeatures: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureText: {
    fontSize: 10,
    color: '#666',
    marginLeft: 2,
    fontWeight: '500',
  },
  propertyStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4CAF50',
    marginRight: 4,
  },
  statusText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '600',
  },
}); 