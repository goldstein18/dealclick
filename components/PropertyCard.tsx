import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export interface PropertyData {
  id: string;
  image: string;
  title: string;
  location: string;
  price: string;
  beds?: number;
  baths?: number;
  area?: number;
}

interface PropertyCardProps {
  property: PropertyData;
  onPress?: () => void;
}

export default function PropertyCard({ property, onPress }: PropertyCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={{ uri: property.image }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.title}>{property.title}</Text>
        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={14} color="#666" />
          <Text style={styles.location}>{property.location}</Text>
        </View>
        
        {/* Property Details */}
        {(property.beds || property.baths || property.area) && (
          <View style={styles.detailsRow}>
            {property.beds && (
              <View style={styles.detail}>
                <Ionicons name="bed-outline" size={16} color="#666" />
                <Text style={styles.detailText}>{property.beds}</Text>
              </View>
            )}
            {property.baths && (
              <View style={styles.detail}>
                <Ionicons name="water-outline" size={16} color="#666" />
                <Text style={styles.detailText}>{property.baths}</Text>
              </View>
            )}
            {property.area && (
              <View style={styles.detail}>
                <Ionicons name="resize-outline" size={16} color="#666" />
                <Text style={styles.detailText}>{property.area}m²</Text>
              </View>
            )}
          </View>
        )}
        
        <Text style={styles.price}>{property.price}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 200,
    backgroundColor: '#f0f0f0',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    fontFamily: 'System',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  location: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
    fontFamily: 'System',
  },
  detailsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  detail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'System',
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    fontFamily: 'System',
  },
});

