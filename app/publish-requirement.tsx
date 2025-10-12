import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useFeed } from "../contexts/FeedContext";
import { requirementsAPI } from "../services/api";

const MAX_CHARACTERS = 280;

export default function PublishRequirementScreen() {
  const { addRequirement } = useFeed();
  const [requirement, setRequirement] = useState("");
  const [location, setLocation] = useState("");
  const [budget, setBudget] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [loading, setLoading] = useState(false);

  const propertyTypes = ["Casa", "Departamento", "Oficina", "Local", "Terreno", "Cualquiera"];
  const characterCount = requirement.length;
  const remainingCharacters = MAX_CHARACTERS - characterCount;
  const isOverLimit = characterCount > MAX_CHARACTERS;

  const handlePublish = async () => {
    // Validate required fields
    if (!requirement.trim()) {
      Alert.alert("Error", "Por favor escribe tu requerimiento");
      return;
    }

    if (isOverLimit) {
      Alert.alert("Error", `El requerimiento no puede exceder ${MAX_CHARACTERS} caracteres`);
      return;
    }

    try {
      setLoading(true);
      
      // Get current user from AsyncStorage
      const userString = await AsyncStorage.getItem('currentUser');
      const currentUser = userString ? JSON.parse(userString) : null;
      
      if (!currentUser) {
        Alert.alert("Error", "No se pudo obtener la información del usuario");
        return;
      }

      console.log('Publishing requirement:', {
        requirement: requirement.trim(),
        propertyType: propertyType || undefined,
        location: location || undefined,
        budget: budget || undefined,
      });

      // Create requirement via API
      const response = await requirementsAPI.create({
        requirement: requirement.trim(),
        propertyType: propertyType || undefined,
        location: location || undefined,
        budget: budget || undefined,
      });

      console.log('Requirement created successfully:', response);

      // Create requirement data for local context
      const requirementData = {
        id: response.id,
        userName: currentUser.name || "Usuario",
        userHandle: currentUser.userHandle || "usuario",
        avatar: currentUser.avatar || require('../assets/images/frontlogo.png'),
        requirement: requirement.trim(),
        timeAgo: "Ahora",
        whatsappNumber: currentUser.whatsappNumber || "",
      };

      // Add to feed context for immediate UI update
      addRequirement(requirementData);

      // Show success message
      Alert.alert(
        "¡Publicado!",
        "Tu requerimiento ha sido publicado exitosamente",
        [
          {
            text: "Ver Feed",
            onPress: () => router.replace("/(tabs)"),
          },
        ]
      );
    } catch (error: any) {
      console.error('Error publishing requirement:', error);
      
      let errorMessage = 'No se pudo publicar el requerimiento. Por favor intenta de nuevo.';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message === 'Network Error') {
        errorMessage = 'Sin conexión a internet. Verifica tu conexión.';
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => router.back()}
        >
          <Ionicons name="close" size={28} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.publishButton,
            (!requirement.trim() || isOverLimit || loading) && styles.publishButtonDisabled,
          ]}
          onPress={handlePublish}
          disabled={!requirement.trim() || isOverLimit || loading}
        >
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#fff" />
              <Text style={styles.publishButtonText}>Publicando...</Text>
            </View>
          ) : (
            <Text
              style={[
                styles.publishButtonText,
                (!requirement.trim() || isOverLimit) && styles.publishButtonTextDisabled,
              ]}
            >
              Publicar
            </Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Main Text Input */}
        <View style={styles.mainSection}>
          <TextInput
            style={styles.mainInput}
            placeholder="¿Qué estás buscando?"
            placeholderTextColor="#999"
            value={requirement}
            onChangeText={setRequirement}
            multiline
            autoFocus
            maxLength={MAX_CHARACTERS + 50} // Allow typing a bit over to show error
          />

          {/* Character Counter */}
          <View style={styles.characterCounter}>
            <Text
              style={[
                styles.characterCountText,
                isOverLimit && styles.characterCountTextError,
              ]}
            >
              {characterCount} / {MAX_CHARACTERS}
            </Text>
          </View>
        </View>

        {/* Quick Filters Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detalles adicionales (Opcional)</Text>
          <Text style={styles.sectionSubtitle}>
            Ayuda a otros a entender mejor lo que buscas
          </Text>

          {/* Property Type */}
          <View style={styles.filterGroup}>
            <View style={styles.filterHeader}>
              <Ionicons name="home-outline" size={20} color="#000" />
              <Text style={styles.filterLabel}>Tipo de propiedad</Text>
            </View>
            <View style={styles.chipsContainer}>
              {propertyTypes.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.chip,
                    propertyType === type && styles.chipActive,
                  ]}
                  onPress={() => setPropertyType(propertyType === type ? "" : type)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      propertyType === type && styles.chipTextActive,
                    ]}
                  >
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Location */}
          <View style={styles.filterGroup}>
            <View style={styles.filterHeader}>
              <Ionicons name="location-outline" size={20} color="#000" />
              <Text style={styles.filterLabel}>Ubicación</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Ej: Las Condes, Santiago"
              value={location}
              onChangeText={setLocation}
            />
          </View>

          {/* Budget */}
          <View style={styles.filterGroup}>
            <View style={styles.filterHeader}>
              <Ionicons name="cash-outline" size={20} color="#000" />
              <Text style={styles.filterLabel}>Presupuesto</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Ej: Hasta $90,000,000"
              value={budget}
              onChangeText={setBudget}
            />
          </View>
        </View>

        {/* Tips Section */}
        <View style={styles.tipsSection}>
          <View style={styles.tipItem}>
            <Ionicons name="bulb-outline" size={20} color="#666" />
            <Text style={styles.tipText}>
              Sé específico sobre lo que buscas para obtener mejores respuestas
            </Text>
          </View>
          <View style={styles.tipItem}>
            <Ionicons name="people-outline" size={20} color="#666" />
            <Text style={styles.tipText}>
              Los agentes inmobiliarios verán tu requerimiento y te contactarán
            </Text>
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
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  closeButton: {
    padding: 4,
  },
  publishButton: {
    backgroundColor: "#000",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  publishButtonDisabled: {
    backgroundColor: "#f0f0f0",
  },
  publishButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
    fontFamily: "System",
  },
  publishButtonTextDisabled: {
    color: "#999",
  },
  scrollView: {
    flex: 1,
  },
  mainSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  mainInput: {
    fontSize: 18,
    color: "#333",
    lineHeight: 26,
    minHeight: 120,
    fontFamily: "System",
  },
  characterCounter: {
    alignItems: "flex-end",
    marginTop: 12,
  },
  characterCountText: {
    fontSize: 14,
    color: "#666",
    fontFamily: "System",
  },
  characterCountTextError: {
    color: "#FF3B30",
    fontWeight: "600",
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
    fontFamily: "System",
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
    fontFamily: "System",
  },
  filterGroup: {
    marginBottom: 20,
  },
  filterHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  filterLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    fontFamily: "System",
  },
  input: {
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: "#333",
    fontFamily: "System",
  },
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e1e5e9",
  },
  chipActive: {
    backgroundColor: "#000",
    borderColor: "#000",
  },
  chipText: {
    fontSize: 13,
    color: "#333",
    fontWeight: "500",
    fontFamily: "System",
  },
  chipTextActive: {
    color: "#fff",
  },
  tipsSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 16,
  },
  tipItem: {
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    fontFamily: "System",
  },
  bottomSpacing: {
    height: 40,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});

