import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export interface AdvisorData {
  id: string;
  nombre: string;
  empresa: string;
  especialidad: string;
  ubicacion: string;
  imagen: string;
  propiedades?: number;
  calificacion?: number;
}

interface AdvisorCardProps {
  advisor: AdvisorData;
  onPress?: () => void;
}

export default function AdvisorCard({ advisor, onPress }: AdvisorCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={{ uri: advisor.imagen }} style={styles.avatar} />
      
      <View style={styles.advisorInfo}>
        <View style={styles.nameRow}>
          <Text style={styles.nombre}>{advisor.nombre}</Text>
        </View>
        
        <Text style={styles.empresa}>{advisor.empresa}</Text>
        
        <View style={styles.detailsRow}>
          <View style={styles.locationChip}>
            <Ionicons name="location" size={12} color="#666" />
            <Text style={styles.locationText}>{advisor.ubicacion}</Text>
          </View>
          
          <View style={styles.specialtyChip}>
            <Ionicons name="home" size={12} color="#666" />
            <Text style={styles.specialtyText}>{advisor.especialidad}</Text>
          </View>
        </View>
        
        {advisor.propiedades !== undefined && (
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Ionicons name="home-outline" size={14} color="#000" />
              <Text style={styles.statText}>{advisor.propiedades} propiedades</Text>
            </View>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginBottom: 8,
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
    borderWidth: 2,
    borderColor: '#f0f0f0',
    backgroundColor: '#f0f0f0',
  },
  advisorInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  nombre: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'System',
  },
  empresa: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
    fontFamily: 'System',
  },
  detailsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 6,
  },
  locationChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  locationText: {
    fontSize: 11,
    color: '#666',
    fontFamily: 'System',
  },
  specialtyChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  specialtyText: {
    fontSize: 11,
    color: '#666',
    fontFamily: 'System',
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: 4,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '600',
    fontFamily: 'System',
  },
});
