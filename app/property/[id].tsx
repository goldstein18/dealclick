import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Dimensions,
    Image,
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { propertiesAPI } from "../../services/api";

const { width } = Dimensions.get("window");

export default function PropertyDetailScreen() {
  const { id } = useLocalSearchParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [propertyData, setPropertyData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        const property = await propertiesAPI.getOne(id as string);
        setPropertyData(property);
      } catch (err: any) {
        console.error('Error fetching property:', err);
        setError('Error al cargar la propiedad');
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  const handleWhatsApp = () => {
    if (!propertyData) return;
    
    const message = encodeURIComponent(
      `Hola, estoy interesado en la propiedad: ${propertyData.title}`
    );
    // Use the user's WhatsApp number if available
    const phoneNumber = propertyData.user?.whatsappNumber || propertyData.user?.phone || "+56912345678";
    Linking.openURL(
      `https://wa.me/${phoneNumber.replace(/\+/g, "")}?text=${message}`
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
        <Text style={styles.loadingText}>Cargando propiedad...</Text>
      </View>
    );
  }

  if (error || !propertyData) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={48} color="#ff6b6b" />
        <Text style={styles.errorText}>{error || 'Propiedad no encontrada'}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => router.back()}>
          <Text style={styles.retryButtonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.shareButton}>
          <Ionicons name="share-outline" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.favoriteButton}>
          <Ionicons name="heart-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
          {/* Image Gallery */}
          <View style={styles.imageGallery}>
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={(e) => {
                const index = Math.round(
                  e.nativeEvent.contentOffset.x / width
                );
                setCurrentImageIndex(index);
              }}
              scrollEventThrottle={16}
            >
              {(propertyData.images || []).map((image, index) => (
                <Image
                  key={index}
                  source={{ uri: image }}
                  style={styles.image}
                />
              ))}
            </ScrollView>
            <View style={styles.pagination}>
              {(propertyData.images || []).map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.paginationDot,
                    currentImageIndex === index && styles.paginationDotActive,
                  ]}
                />
              ))}
            </View>
          </View>

        {/* Property Info */}
        <View style={styles.content}>
          {/* Price and Title */}
          <View style={styles.priceSection}>
            <Text style={styles.price}>
              {propertyData.price ? `$${parseFloat(propertyData.price).toLocaleString()}` : 'Consultar precio'}
            </Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>{propertyData.status || 'En Venta'}</Text>
            </View>
          </View>

          <Text style={styles.title}>{propertyData.title}</Text>
          
          <View style={styles.locationRow}>
            <Ionicons name="location" size={18} color="#666" />
            <Text style={styles.location}>{propertyData.location}</Text>
          </View>

          {/* Quick Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <Ionicons name="bed-outline" size={24} color="#000" />
              <Text style={styles.statNumber}>{propertyData.beds || 0}</Text>
              <Text style={styles.statLabel}>Habitaciones</Text>
            </View>
            <View style={styles.statBox}>
              <Ionicons name="water-outline" size={24} color="#000" />
              <Text style={styles.statNumber}>{propertyData.baths || 0}</Text>
              <Text style={styles.statLabel}>Baños</Text>
            </View>
            <View style={styles.statBox}>
              <Ionicons name="resize-outline" size={24} color="#000" />
              <Text style={styles.statNumber}>{propertyData.area || 0}</Text>
              <Text style={styles.statLabel}>m²</Text>
            </View>
            <View style={styles.statBox}>
              <Ionicons name="car-outline" size={24} color="#000" />
              <Text style={styles.statNumber}>{propertyData.parking || 0}</Text>
              <Text style={styles.statLabel}>Estacionamiento</Text>
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Descripción</Text>
            <Text style={styles.description}>{propertyData.description || 'Sin descripción disponible'}</Text>
          </View>

          {/* Property Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Detalles de la Propiedad</Text>
            <View style={styles.detailsGrid}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Tipo</Text>
                <Text style={styles.detailValue}>{propertyData.propertyType || 'No especificado'}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Año de construcción</Text>
                <Text style={styles.detailValue}>{propertyData.yearBuilt || 'No especificado'}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Área total</Text>
                <Text style={styles.detailValue}>{propertyData.area || 0} m²</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Estado</Text>
                <Text style={styles.detailValue}>{propertyData.status || 'En Venta'}</Text>
              </View>
            </View>
          </View>

          {/* Amenities */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Amenidades</Text>
            <View style={styles.amenitiesContainer}>
              {(propertyData.amenities || []).map((amenity, index) => (
                <View key={index} style={styles.amenityChip}>
                  <Ionicons name="checkmark-circle" size={16} color="#34C759" />
                  <Text style={styles.amenityText}>{amenity}</Text>
                </View>
              ))}
              {(!propertyData.amenities || propertyData.amenities.length === 0) && (
                <Text style={styles.noDataText}>No hay amenidades especificadas</Text>
              )}
            </View>
          </View>

          {/* Features */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Características</Text>
            <View style={styles.featuresContainer}>
              {(propertyData.features || []).map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <Ionicons name="chevron-forward" size={16} color="#666" />
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
              {(!propertyData.features || propertyData.features.length === 0) && (
                <Text style={styles.noDataText}>No hay características especificadas</Text>
              )}
            </View>
          </View>

          {/* Agent Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Agente</Text>
            <View style={styles.agentCard}>
              <Image
                source={{ uri: propertyData.user?.avatar || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400" }}
                style={styles.agentImage}
              />
              <View style={styles.agentInfo}>
                <Text style={styles.agentName}>{propertyData.user?.name || 'Agente'}</Text>
                <Text style={styles.agentCompany}>{propertyData.user?.company || 'Empresa no especificada'}</Text>
              </View>
            </View>
          </View>

          <View style={styles.bottomSpacing} />
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.primaryButton} onPress={handleWhatsApp}>
          <Ionicons name="logo-whatsapp" size={20} color="#fff" />
          <Text style={styles.primaryButtonText}>Contactar por WhatsApp</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    position: "absolute",
    top: 60,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginLeft: "auto",
    marginRight: 8,
  },
  favoriteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageGallery: {
    height: 400,
    backgroundColor: "#f0f0f0",
  },
  image: {
    width: width,
    height: 400,
  },
  pagination: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
  paginationDotActive: {
    backgroundColor: "#fff",
    width: 24,
  },
  content: {
    padding: 20,
  },
  priceSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  price: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#000",
    fontFamily: "System",
  },
  statusBadge: {
    backgroundColor: "#000",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
    fontFamily: "System",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
    fontFamily: "System",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 24,
  },
  location: {
    fontSize: 16,
    color: "#666",
    fontFamily: "System",
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: "#f8f9fa",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    justifyContent: "space-between",
  },
  statBox: {
    alignItems: "center",
    flex: 1,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    marginTop: 8,
    fontFamily: "System",
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
    textAlign: "center",
    fontFamily: "System",
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
    fontFamily: "System",
  },
  description: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
    fontFamily: "System",
  },
  detailsGrid: {
    gap: 16,
  },
  detailItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  detailLabel: {
    fontSize: 15,
    color: "#666",
    fontFamily: "System",
  },
  detailValue: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    fontFamily: "System",
  },
  amenitiesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  amenityChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 8,
  },
  amenityText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
    fontFamily: "System",
  },
  featuresContainer: {
    gap: 12,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  featureText: {
    fontSize: 15,
    color: "#333",
    fontFamily: "System",
  },
  agentCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    padding: 16,
    borderRadius: 16,
  },
  agentImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  agentInfo: {
    flex: 1,
  },
  agentName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
    fontFamily: "System",
  },
  agentCompany: {
    fontSize: 14,
    color: "#666",
    fontFamily: "System",
  },
  bottomSpacing: {
    height: 100,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 34,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 10,
  },
  primaryButton: {
    flexDirection: "row",
    backgroundColor: "#000",
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "System",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
    fontFamily: "System",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: "#ff6b6b",
    textAlign: "center",
    fontFamily: "System",
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: "#000",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "System",
  },
  noDataText: {
    fontSize: 14,
    color: "#999",
    fontStyle: "italic",
    fontFamily: "System",
  },
});

