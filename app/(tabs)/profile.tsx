import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, Dimensions, FlatList, Image, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useFeed } from '../../contexts/FeedContext';
import { authAPI, propertiesAPI, requirementsAPI } from '../../services/api';

const { width } = Dimensions.get('window');

// User Property Card Component - X Style
const UserPropertyCard = ({ property, onEdit, onHide }: { property: any, onEdit: () => void, onHide: () => void }) => (
  <View style={styles.xStyleCard}>
    <View style={styles.xPropertyContainer}>
      <Image 
        source={{ uri: property.images?.[0] || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400' }} 
        style={styles.xPropertyImage} 
      />
      <View style={styles.xPropertyInfo}>
        <Text style={styles.xPropertyTitle} numberOfLines={1}>{property.title}</Text>
        <View style={styles.xPropertyDetails}>
          <Ionicons name="location-outline" size={12} color="#536471" />
          <Text style={styles.xPropertyLocation} numberOfLines={1}>{property.location}</Text>
        </View>
        <Text style={styles.xPropertyPrice}>${property.price?.toLocaleString()}</Text>
      </View>
    </View>
    <View style={styles.xCardFooter}>
      <View style={styles.xPropertyStats}>
        {property.bedrooms > 0 && (
          <View style={styles.xPropertyStat}>
            <Ionicons name="bed-outline" size={14} color="#536471" />
            <Text style={styles.xPropertyStatText}>{property.bedrooms}</Text>
          </View>
        )}
        {property.bathrooms > 0 && (
          <View style={styles.xPropertyStat}>
            <Ionicons name="water-outline" size={14} color="#536471" />
            <Text style={styles.xPropertyStatText}>{property.bathrooms}</Text>
          </View>
        )}
        {property.area > 0 && (
          <View style={styles.xPropertyStat}>
            <Ionicons name="resize-outline" size={14} color="#536471" />
            <Text style={styles.xPropertyStatText}>{property.area}m²</Text>
          </View>
        )}
      </View>
      <View style={styles.xActionsRow}>
        <TouchableOpacity style={styles.xActionButton} onPress={onEdit}>
          <Ionicons name="create-outline" size={18} color="#536471" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.xActionButton} onPress={onHide}>
          <Ionicons name="eye-off-outline" size={18} color="#536471" />
        </TouchableOpacity>
      </View>
    </View>
  </View>
);

// User Requirement Card Component - X Style
const UserRequirementCard = ({ requirement, onEdit, onHide }: { requirement: any, onEdit: () => void, onHide: () => void }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Ahora';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d`;
    return date.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' });
  };

  return (
    <View style={styles.xStyleCard}>
      <View style={styles.xCardContent}>
        <Text style={styles.xRequirementText}>{requirement.requirement}</Text>
        
        {(requirement.propertyType || requirement.location || requirement.budget) && (
          <View style={styles.xTagsContainer}>
            {requirement.propertyType && (
              <View style={styles.xTag}>
                <Ionicons name="home-outline" size={12} color="#666" />
                <Text style={styles.xTagText}>{requirement.propertyType}</Text>
              </View>
            )}
            {requirement.location && (
              <View style={styles.xTag}>
                <Ionicons name="location-outline" size={12} color="#666" />
                <Text style={styles.xTagText}>{requirement.location}</Text>
              </View>
            )}
            {requirement.budget && (
              <View style={styles.xTag}>
                <Ionicons name="cash-outline" size={12} color="#666" />
                <Text style={styles.xTagText}>{requirement.budget}</Text>
              </View>
            )}
          </View>
        )}
        
        <View style={styles.xCardFooter}>
          <Text style={styles.xTimeText}>{formatDate(requirement.createdAt)}</Text>
          
          <View style={styles.xActionsRow}>
            <TouchableOpacity style={styles.xActionButton} onPress={onEdit}>
              <Ionicons name="create-outline" size={18} color="#536471" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.xActionButton} onPress={onHide}>
              <Ionicons name="eye-off-outline" size={18} color="#536471" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const EMPRESAS = [
  "Century 21",
  "RE/MAX",
  "Keller Williams",
  "Coldwell Banker",
  "Engel & Völkers",
  "Otra"
];


export default function ProfileScreen() {
  const { setOnRequirementAdded, setOnPropertyAdded } = useFeed();
  const [image, setImage] = useState<string | null>(null);
  const [nombre, setNombre] = useState("");
  const [bio, setBio] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [empresa, setEmpresa] = useState(EMPRESAS[0]);
  const [loading, setLoading] = useState(true);
  const [userHandle, setUserHandle] = useState("");
  
  // New states for user content
  const [activeSegment, setActiveSegment] = useState<'properties' | 'requirements'>('properties');
  const [userProperties, setUserProperties] = useState<any[]>([]);
  const [userRequirements, setUserRequirements] = useState<any[]>([]);
  const [contentLoading, setContentLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadUserData();
    loadUserContent();
  }, []);

  // Reload content when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadUserContent();
      loadUserData(false); // Also refresh user data to get updated avatar (without showing loading screen)
    }, [])
  );

  // Set up callbacks for when new content is added
  useEffect(() => {
    if (setOnRequirementAdded) {
      setOnRequirementAdded(() => loadUserContent);
    }
    if (setOnPropertyAdded) {
      setOnPropertyAdded(() => loadUserContent);
    }
  }, [setOnRequirementAdded, setOnPropertyAdded]);

  const loadUserContent = async () => {
    try {
      setContentLoading(true);
      
      // Get current user from AsyncStorage
      const userData = await AsyncStorage.getItem('currentUser');
      if (!userData) {
        console.log('No user data found in AsyncStorage');
        return;
      }
      
      const currentUser = JSON.parse(userData);
      console.log('Loading content for user:', currentUser.id, currentUser.name);
      
      // Load user properties and requirements in parallel
      console.log('Making API calls for user ID:', currentUser.id);
      
      const [propertiesResponse, requirementsResponse] = await Promise.all([
        propertiesAPI.getByUser(currentUser.id).catch(err => {
          console.error('Error fetching properties:', err);
          return { data: [] };
        }),
        requirementsAPI.getByUser(currentUser.id).catch(err => {
          console.error('Error fetching requirements:', err);
          return { data: [] };
        })
      ]);
      
      console.log('Properties response:', propertiesResponse);
      console.log('Requirements response:', requirementsResponse);
      
      // Filter out hidden items (items with hidden: true)
      // If the API returns an array directly (not wrapped in .data), handle both cases
      const propertiesArray = Array.isArray(propertiesResponse) ? propertiesResponse : (propertiesResponse.data || []);
      const requirementsArray = Array.isArray(requirementsResponse) ? requirementsResponse : (requirementsResponse.data || []);
      
      const visibleProperties = propertiesArray.filter((p: any) => !p.hidden);
      const visibleRequirements = requirementsArray.filter((r: any) => !r.hidden);
      
      console.log('Properties array:', propertiesArray);
      console.log('Requirements array:', requirementsArray);
      console.log('Visible properties:', visibleProperties.length);
      console.log('Visible requirements:', visibleRequirements.length);
      
      setUserProperties(visibleProperties);
      setUserRequirements(visibleRequirements);
      
    } catch (error) {
      console.error('Error loading user content:', error);
      Alert.alert(
        'Error', 
        'No se pudo cargar tu contenido. Verifica tu conexión a internet.',
        [{ text: 'OK' }]
      );
    } finally {
      setContentLoading(false);
    }
  };

  const handleEditProperty = (property: any) => {
    // TODO: Navigate to edit property screen
    console.log('Edit property:', property);
    Alert.alert('Editar propiedad', 'Funcionalidad de edición próximamente');
  };

  const handleHideProperty = async (propertyId: string) => {
    Alert.alert(
      'Ocultar propiedad',
      '¿Estás seguro de que quieres ocultar esta propiedad?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Ocultar',
          style: 'destructive',
          onPress: async () => {
            try {
              // Update property to set hidden: true
              await propertiesAPI.update(propertyId, { hidden: true });
              
              // Remove from local state
              setUserProperties(prev => prev.filter(p => p.id !== propertyId));
              
              Alert.alert('Éxito', 'Propiedad ocultada correctamente');
            } catch (error) {
              console.error('Error hiding property:', error);
              Alert.alert('Error', 'No se pudo ocultar la propiedad');
            }
          }
        }
      ]
    );
  };

  const handleEditRequirement = (requirement: any) => {
    // TODO: Navigate to edit requirement screen
    console.log('Edit requirement:', requirement);
    Alert.alert('Editar requerimiento', 'Funcionalidad de edición próximamente');
  };

  const handleHideRequirement = async (requirementId: string) => {
    Alert.alert(
      'Ocultar requerimiento',
      '¿Estás seguro de que quieres ocultar este requerimiento?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Ocultar',
          style: 'destructive',
          onPress: async () => {
            try {
              // Update requirement to set hidden: true
              await requirementsAPI.update(requirementId, { hidden: true });
              
              // Remove from local state
              setUserRequirements(prev => prev.filter(r => r.id !== requirementId));
              
              Alert.alert('Éxito', 'Requerimiento ocultado correctamente');
            } catch (error) {
              console.error('Error hiding requirement:', error);
              Alert.alert('Error', 'No se pudo ocultar el requerimiento');
            }
          }
        }
      ]
    );
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([loadUserData(false), loadUserContent()]);
    setRefreshing(false);
  };

  const loadUserData = async (showLoading = true) => {
    try {
      if (showLoading) {
        setLoading(true);
      }
      
      // Check if user is logged in
      const token = await AsyncStorage.getItem('auth_token');
      if (!token) {
        // Not logged in, redirect to welcome
        router.replace('/auth/welcome');
        return;
      }

      // Load user data from AsyncStorage (saved during login)
      const userData = await AsyncStorage.getItem('currentUser');
      if (userData) {
        const user = JSON.parse(userData);
        setNombre(user.name || "");
        setEmail(user.email || "");
        setUserHandle(user.userHandle || "");
        setImage(user.avatar || null);
        setTelefono(user.phone || "");
        setEmpresa(user.company || "Independiente");
        setBio(user.bio || "");
      }

      // Always fetch fresh user data from server to get updated avatar
      try {
        console.log('📡 Fetching fresh user data from server...');
        const freshUserData = await authAPI.getCurrentUser();
        if (freshUserData) {
          console.log('✅ Fresh user data received!');
          console.log('👤 User name:', freshUserData.name);
          console.log('🖼️ Avatar URL:', freshUserData.avatar);
          console.log('📧 Email:', freshUserData.email);
          
          setNombre(freshUserData.name || "");
          setEmail(freshUserData.email || "");
          setUserHandle(freshUserData.userHandle || "");
          
          // Force update avatar with fresh URL
          const newAvatar = freshUserData.avatar || null;
          console.log('🔄 Updating avatar state from:', image, 'to:', newAvatar);
          setImage(newAvatar);
          
          setTelefono(freshUserData.phone || "");
          setEmpresa(freshUserData.company || "Independiente");
          setBio(freshUserData.bio || "");
          
          // Update AsyncStorage with fresh data
          await AsyncStorage.setItem('currentUser', JSON.stringify(freshUserData));
          console.log('💾 AsyncStorage updated with fresh data');
        }
      } catch (serverError) {
        console.error('❌ Could not fetch fresh user data:', serverError);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      router.replace('/auth/welcome');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };



  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#000" />
        <Text style={styles.loadingText}>Cargando perfil...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container} 
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor="#000"
          colors={["#000"]}
        />
      }
    >
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
                  style={styles.logoutButton} 
                  onPress={handleLogout}
                >
                  <Ionicons name="log-out-outline" size={18} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.settingsButton} 
                  onPress={() => router.push('/profile-settings')}
                >
                  <Ionicons name="settings-outline" size={18} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.profileSection}>
              <View style={styles.avatarContainer}>
                <View style={styles.avatarGlow} />
                <Image
                  source={image ? { uri: image, cache: 'reload' } : require('../../assets/images/frontlogo.png')}
                  style={styles.avatar}
                  onError={(error) => console.log('Image load error:', error)}
                  onLoad={() => console.log('Image loaded successfully:', image)}
                  key={image || 'default'}
                />
              </View>
              
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


      {/* Segment Control - Full Width */}
      <View style={styles.segmentControl}>
        <TouchableOpacity 
          style={[styles.segment, activeSegment === 'properties' && styles.activeSegment]} 
          onPress={() => setActiveSegment('properties')}
        >
          <Text style={[styles.segmentText, activeSegment === 'properties' && styles.activeSegmentText]}>
            Propiedades
          </Text>
          {userProperties.length > 0 && (
            <Text style={[styles.segmentCount, activeSegment === 'properties' && styles.activeSegmentCount]}>
              {userProperties.length}
            </Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.segment, activeSegment === 'requirements' && styles.activeSegment]} 
          onPress={() => setActiveSegment('requirements')}
        >
          <Text style={[styles.segmentText, activeSegment === 'requirements' && styles.activeSegmentText]}>
            Requerimientos
          </Text>
          {userRequirements.length > 0 && (
            <Text style={[styles.segmentCount, activeSegment === 'requirements' && styles.activeSegmentCount]}>
              {userRequirements.length}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Loading State */}
      {contentLoading && (
        <View style={styles.loadingState}>
          <ActivityIndicator size="small" color="#000" />
          <Text style={styles.loadingText}>Cargando contenido...</Text>
        </View>
      )}

      {/* Content List */}
      {!contentLoading && (
        <FlatList
          data={activeSegment === 'properties' ? userProperties : userRequirements}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
          renderItem={({ item }) => (
            activeSegment === 'properties' ? (
              <UserPropertyCard 
                property={item}
                onEdit={() => handleEditProperty(item)}
                onHide={() => handleHideProperty(item.id)}
              />
            ) : (
              <UserRequirementCard 
                requirement={item}
                onEdit={() => handleEditRequirement(item)}
                onHide={() => handleHideRequirement(item.id)}
              />
            )
          )}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons 
                name={activeSegment === 'properties' ? 'home-outline' : 'document-text-outline'} 
                size={48} 
                color="#ccc" 
              />
              <Text style={styles.emptyText}>
                No tienes {activeSegment === 'properties' ? 'propiedades' : 'requerimientos'} publicados
              </Text>
              <TouchableOpacity 
                style={styles.emptyButton}
                onPress={() => router.push(activeSegment === 'properties' ? '/publish-property' : '/publish-requirement')}
              >
                <Text style={styles.emptyButtonText}>
                  Publicar {activeSegment === 'properties' ? 'propiedad' : 'requerimiento'}
                </Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}

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
  logoutButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
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
  // Segment Control Styles - X/Reddit Style (Full Width)
  segmentControl: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eff3f4',
    width: '100%',
  },
  segment: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    flexDirection: 'row',
    gap: 6,
  },
  activeSegment: {
    borderBottomWidth: 3,
    borderBottomColor: '#1d9bf0',
  },
  segmentText: {
    fontSize: 15,
    color: '#536471',
    fontWeight: '600',
    fontFamily: 'System',
  },
  activeSegmentText: {
    color: '#0f1419',
    fontWeight: '700',
  },
  segmentCount: {
    fontSize: 13,
    color: '#536471',
    fontWeight: '500',
    fontFamily: 'System',
  },
  activeSegmentCount: {
    color: '#0f1419',
    fontWeight: '600',
  },
  // User Content Card Styles
  userContentCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  userContentImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  userContentInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  userContentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
    fontFamily: 'System',
  },
  userContentSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
    fontFamily: 'System',
  },
  userContentPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    fontFamily: 'System',
  },
  userContentDate: {
    fontSize: 12,
    color: '#999',
    fontFamily: 'System',
  },
  userContentActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Empty State Styles
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
    fontFamily: 'System',
  },
  emptyButton: {
    backgroundColor: '#000',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'System',
  },
  // Refresh Button
  refreshButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
  },
  // Loading State
  loadingState: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: 8,
    backgroundColor: '#fff',
  },
  // X-Style Card (Twitter-like) - No background
  xStyleCard: {
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderBottomColor: '#eff3f4',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  xCardContent: {
    flex: 1,
  },
  xRequirementText: {
    fontSize: 15,
    lineHeight: 20,
    color: '#0f1419',
    marginBottom: 8,
    fontFamily: 'System',
  },
  xTagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  xTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f7f9f9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  xTagText: {
    fontSize: 13,
    color: '#536471',
    fontFamily: 'System',
  },
  xCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  xTimeText: {
    fontSize: 13,
    color: '#536471',
    fontFamily: 'System',
  },
  xActionsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  xActionButton: {
    padding: 4,
  },
  // X-Style Property Card
  xPropertyContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  xPropertyImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 12,
  },
  xPropertyInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  xPropertyTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0f1419',
    marginBottom: 4,
    fontFamily: 'System',
  },
  xPropertyDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  xPropertyLocation: {
    fontSize: 13,
    color: '#536471',
    flex: 1,
    fontFamily: 'System',
  },
  xPropertyPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f1419',
    fontFamily: 'System',
  },
  xPropertyStats: {
    flexDirection: 'row',
    gap: 12,
  },
  xPropertyStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  xPropertyStatText: {
    fontSize: 13,
    color: '#536471',
    fontFamily: 'System',
  },
}); 