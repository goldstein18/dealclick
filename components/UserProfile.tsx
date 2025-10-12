import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import React from "react";
import { Image, Linking, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export interface UserProfileData {
  id: string;
  name: string;
  role: string;
  license?: string;
  bio?: string;
  email?: string;
  phone?: string;
  company?: string;
  experience?: string;
  specialties?: string[];
  image?: string;
}

interface UserProfileProps {
  user: UserProfileData;
  isEditable?: boolean;
  onEditPress?: () => void;
  onSettingsPress?: () => void;
}

export default function UserProfile({ 
  user, 
  isEditable = false,
  onEditPress,
  onSettingsPress 
}: UserProfileProps) {
  
  const handleEmailPress = () => {
    if (user.email) {
      Linking.openURL(`mailto:${user.email}`);
    }
  };

  const handlePhonePress = () => {
    if (user.phone) {
      Linking.openURL(`tel:${user.phone}`);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header with Gradient */}
      <LinearGradient
        colors={['#000', '#1a1a1a', '#2d2d2d']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        {isEditable && (
          <View style={styles.headerButtons}>
            {onSettingsPress && (
              <TouchableOpacity 
                style={styles.headerButton} 
                onPress={onSettingsPress}
              >
                <Ionicons name="settings-outline" size={24} color="#fff" />
              </TouchableOpacity>
            )}
            {onEditPress && (
              <TouchableOpacity 
                style={styles.headerButton} 
                onPress={onEditPress}
              >
                <Ionicons name="create-outline" size={24} color="#fff" />
              </TouchableOpacity>
            )}
          </View>
        )}

        <View style={styles.profileImageContainer}>
          {user.image ? (
            <Image 
              source={{ uri: user.image }} 
              style={styles.profileImage}
            />
          ) : (
            <View style={styles.profileImagePlaceholder}>
              <Ionicons name="person" size={60} color="#666" />
            </View>
          )}
        </View>

        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.role}>{user.role}</Text>
        {user.license && (
          <Text style={styles.license}>Licencia: {user.license}</Text>
        )}
      </LinearGradient>

      {/* Bio Section */}
      {user.bio && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sobre mí</Text>
          <Text style={styles.bio}>{user.bio}</Text>
        </View>
      )}

      {/* Contact Section */}
      {(user.email || user.phone || user.company) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contacto</Text>
          
          {user.email && (
            <TouchableOpacity 
              style={styles.contactItem}
              onPress={handleEmailPress}
            >
              <Ionicons name="mail-outline" size={20} color="#000" />
              <Text style={styles.contactText}>{user.email}</Text>
            </TouchableOpacity>
          )}
          
          {user.phone && (
            <TouchableOpacity 
              style={styles.contactItem}
              onPress={handlePhonePress}
            >
              <Ionicons name="call-outline" size={20} color="#000" />
              <Text style={styles.contactText}>{user.phone}</Text>
            </TouchableOpacity>
          )}
          
          {user.company && (
            <View style={styles.contactItem}>
              <Ionicons name="business-outline" size={20} color="#000" />
              <Text style={styles.contactText}>{user.company}</Text>
            </View>
          )}
        </View>
      )}

      {/* Experience Section */}
      {user.experience && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Experiencia</Text>
          <Text style={styles.experienceText}>{user.experience}</Text>
        </View>
      )}

      {/* Specialties Section */}
      {user.specialties && user.specialties.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Especialidades</Text>
          <View style={styles.specialtiesContainer}>
            {user.specialties.map((specialty, index) => (
              <View key={index} style={styles.specialtyChip}>
                <Text style={styles.specialtyText}>{specialty}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerButtons: {
    position: 'absolute',
    top: 60,
    right: 20,
    flexDirection: 'row',
    gap: 12,
    zIndex: 1,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImageContainer: {
    marginBottom: 16,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#fff',
  },
  profileImagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#fff',
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
    fontFamily: 'System',
    textAlign: 'center',
  },
  role: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 4,
    fontFamily: 'System',
  },
  license: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    fontFamily: 'System',
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    fontFamily: 'System',
  },
  bio: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
    fontFamily: 'System',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  contactText: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'System',
  },
  experienceText: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
    fontFamily: 'System',
  },
  specialtiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  specialtyChip: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  specialtyText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
    fontFamily: 'System',
  },
});

