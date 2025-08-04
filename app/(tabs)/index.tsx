import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

export default function FeedScreen() {
  const [activeSegment, setActiveSegment] = useState('properties');

  // Datos de ejemplo para propiedades
  const properties = [
    {
      id: 1,
      title: "Casa moderna en Las Condes",
      price: "$85,000,000",
      location: "Las Condes, Santiago",
      image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400",
      bedrooms: 3,
      bathrooms: 2,
      area: "120m²"
    },
    {
      id: 2,
      title: "Departamento premium en Providencia",
      price: "$65,000,000",
      location: "Providencia, Santiago",
      image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400",
      bedrooms: 2,
      bathrooms: 2,
      area: "85m²"
    }
  ];

  // Datos de ejemplo para requerimientos
  const requirements = [
    {
      id: 1,
      user: "María González",
      handle: "@mariagonzalez",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100",
      content: "Busco departamento de 2-3 dormitorios en Las Condes, presupuesto hasta $90M. ¿Alguien tiene algo disponible?",
      time: "2h",
      likes: 12,
      replies: 5,
      shares: 3
    },
    {
      id: 2,
      user: "Carlos Mendoza",
      handle: "@carlosmendoza",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
      content: "Cliente busca oficina comercial en Providencia, mínimo 100m². Zona céntrica y buena conectividad. Contactar DM.",
      time: "4h",
      likes: 8,
      replies: 3,
      shares: 1
    }
  ];

  const handleSegmentPress = (segment: 'properties' | 'requirements') => {
    console.log('Switching to:', segment);
    setActiveSegment(segment);
  };

  return (
    <View style={styles.container}>
      {/* Segmented Control */}
      <View style={styles.segmentedControl}>
        <TouchableOpacity 
          style={[styles.segment, activeSegment === 'properties' && styles.activeSegment]} 
          onPress={() => handleSegmentPress('properties')}
        >
          <Text style={[styles.segmentText, activeSegment === 'properties' && styles.activeSegmentText]}>
            Propiedades
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.segment, activeSegment === 'requirements' && styles.activeSegment]} 
          onPress={() => handleSegmentPress('requirements')}
        >
          <Text style={[styles.segmentText, activeSegment === 'requirements' && styles.activeSegmentText]}>
            Requerimientos
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {activeSegment === 'properties' ? (
          // Sección de Propiedades
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Propiedades Disponibles ({properties.length})</Text>
            
            {properties.map((property) => (
              <TouchableOpacity key={property.id} style={styles.propertyCard}>
                <Image source={{ uri: property.image }} style={styles.propertyImage} />
                <View style={styles.propertyInfo}>
                  <Text style={styles.propertyTitle}>{property.title}</Text>
                  <Text style={styles.propertyLocation}>{property.location}</Text>
                  <View style={styles.propertyDetails}>
                    <Text style={styles.propertyDetail}>{property.bedrooms} hab</Text>
                    <Text style={styles.propertyDetail}>•</Text>
                    <Text style={styles.propertyDetail}>{property.bathrooms} baños</Text>
                    <Text style={styles.propertyDetail}>•</Text>
                    <Text style={styles.propertyDetail}>{property.area}</Text>
                  </View>
                  <Text style={styles.propertyPrice}>{property.price}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          // Sección de Requerimientos
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Requerimientos Recientes ({requirements.length})</Text>
            
            {requirements.map((requirement) => (
              <TouchableOpacity key={requirement.id} style={styles.requirementCard}>
                <Image source={{ uri: requirement.avatar }} style={styles.avatar} />
                <View style={styles.requirementContent}>
                  <View style={styles.requirementHeader}>
                    <Text style={styles.userName}>{requirement.user}</Text>
                    <Text style={styles.userHandle}>{requirement.handle}</Text>
                    <Text style={styles.time}>• {requirement.time}</Text>
                  </View>
                  <Text style={styles.requirementText}>{requirement.content}</Text>
                  <View style={styles.requirementActions}>
                    <TouchableOpacity style={styles.actionButton}>
                      <Ionicons name="chatbubble-outline" size={16} color="#666" />
                      <Text style={styles.actionText}>{requirement.replies}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton}>
                      <Ionicons name="heart-outline" size={16} color="#666" />
                      <Text style={styles.actionText}>{requirement.likes}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton}>
                      <Ionicons name="share-outline" size={16} color="#666" />
                      <Text style={styles.actionText}>{requirement.shares}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab}>
        <Ionicons name="add" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },

  segmentedControl: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginTop: 10,
    borderRadius: 12,
    padding: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#e1e5e9",
  },
  segment: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 8,
  },
  activeSegment: {
    backgroundColor: "#C35139",
  },
  segmentText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  activeSegmentText: {
    color: "#fff",
    fontWeight: "600",
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#C35139",
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  // Estilos para propiedades
  propertyCard: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    overflow: "hidden",
  },
  propertyImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  propertyInfo: {
    padding: 16,
  },
  propertyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#C35139",
    marginBottom: 4,
  },
  propertyLocation: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  propertyDetails: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  propertyDetail: {
    fontSize: 14,
    color: "#666",
    marginRight: 8,
  },
  propertyPrice: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#C35139",
  },
  // Estilos para requerimientos
  requirementCard: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  requirementContent: {
    flex: 1,
  },
  requirementHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#C35139",
    marginRight: 8,
  },
  userHandle: {
    fontSize: 14,
    color: "#666",
    marginRight: 8,
  },
  time: {
    fontSize: 14,
    color: "#999",
  },
  requirementText: {
    fontSize: 16,
    color: "#C35139",
    lineHeight: 22,
    marginBottom: 12,
  },
  requirementActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    maxWidth: 200,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
  },
  actionText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 4,
  },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 30,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#C35139",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
}); 