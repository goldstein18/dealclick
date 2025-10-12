import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { uploadImages } from "../services/storage.service";

export default function PublishPropertyScreen() {
  const [images, setImages] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [location, setLocation] = useState("");
  const [beds, setBeds] = useState("");
  const [baths, setBaths] = useState("");
  const [area, setArea] = useState("");
  const [parking, setParking] = useState("");
  const [amenities, setAmenities] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const propertyTypes = ["Casa", "Departamento", "Oficina", "Local", "Terreno"];
  const availableAmenities = [
    "Piscina",
    "Gimnasio",
    "Jardín",
    "Terraza",
    "Seguridad 24/7",
    "Sala de eventos",
    "Bodega",
    "Cocina equipada",
  ];

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permisos necesarios",
        "Necesitamos acceso a tu galería para agregar fotos."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled) {
      const newImages = result.assets.map((asset) => asset.uri);
      setImages([...images, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const toggleAmenity = (amenity: string) => {
    if (amenities.includes(amenity)) {
      setAmenities(amenities.filter((a) => a !== amenity));
    } else {
      setAmenities([...amenities, amenity]);
    }
  };

  const handlePublish = async () => {
    // Validate required fields
    if (!title.trim()) {
      Alert.alert("Error", "Por favor ingresa el título de la propiedad");
      return;
    }
    if (!price.trim()) {
      Alert.alert("Error", "Por favor ingresa el precio");
      return;
    }
    if (!propertyType) {
      Alert.alert("Error", "Por favor selecciona el tipo de propiedad");
      return;
    }
    if (!location.trim()) {
      Alert.alert("Error", "Por favor ingresa la ubicación");
      return;
    }
    if (images.length === 0) {
      Alert.alert("Error", "Por favor agrega al menos una foto");
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(0);

      // Get auth token
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        Alert.alert("Error", "No estás autenticado. Por favor inicia sesión.");
        return;
      }

      // Upload images to Backblaze B2
      const uploadedImages = await uploadImages(images, token, (progress) => {
        setUploadProgress(progress);
      });

      // Extract medium-sized URLs for display
      const imageUrls = uploadedImages.map((img) => img.medium);

      // Prepare property data
      const propertyData = {
        title,
        description,
        price: parseFloat(price),
        propertyType,
        location,
        beds: parseInt(beds) || 0,
        baths: parseInt(baths) || 0,
        area: parseInt(area) || 0,
        parking: parseInt(parking) || 0,
        amenities,
        images: imageUrls,
      };

      // TODO: Send to API endpoint
      console.log("Publishing property:", propertyData);

      Alert.alert(
        "¡Éxito!",
        "Tu propiedad ha sido publicada con imágenes en Backblaze B2",
        [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      console.error("Error publishing property:", error);
      Alert.alert(
        "Error",
        "No se pudo publicar la propiedad. Por favor intenta de nuevo."
      );
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="close" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Publicar Propiedad</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Images Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Fotos <Text style={styles.required}>*</Text>
          </Text>
          <Text style={styles.sectionSubtitle}>
            Agrega al menos 3 fotos de tu propiedad
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.imagesContainer}
          >
            <TouchableOpacity style={styles.addImageButton} onPress={pickImage}>
              <Ionicons name="camera-outline" size={32} color="#666" />
              <Text style={styles.addImageText}>Agregar fotos</Text>
            </TouchableOpacity>

            {images.map((image, index) => (
              <View key={index} style={styles.imagePreview}>
                <Image source={{ uri: image }} style={styles.previewImage} />
                <TouchableOpacity
                  style={styles.removeImageButton}
                  onPress={() => removeImage(index)}
                >
                  <Ionicons name="close-circle" size={24} color="#fff" />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Title */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Título <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: Casa moderna en Las Condes"
            value={title}
            onChangeText={setTitle}
            maxLength={100}
          />
        </View>

        {/* Property Type */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Tipo de Propiedad <Text style={styles.required}>*</Text>
          </Text>
          <View style={styles.chipsContainer}>
            {propertyTypes.map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.chip,
                  propertyType === type && styles.chipActive,
                ]}
                onPress={() => setPropertyType(type)}
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

        {/* Price */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Precio <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: $85,000,000"
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
          />
        </View>

        {/* Location */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Ubicación <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: Las Condes, Santiago"
            value={location}
            onChangeText={setLocation}
          />
        </View>

        {/* Property Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detalles</Text>
          <View style={styles.detailsGrid}>
            <View style={styles.detailInput}>
              <Ionicons name="bed-outline" size={20} color="#666" />
              <TextInput
                style={styles.detailField}
                placeholder="Habitaciones"
                value={beds}
                onChangeText={setBeds}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.detailInput}>
              <Ionicons name="water-outline" size={20} color="#666" />
              <TextInput
                style={styles.detailField}
                placeholder="Baños"
                value={baths}
                onChangeText={setBaths}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.detailInput}>
              <Ionicons name="resize-outline" size={20} color="#666" />
              <TextInput
                style={styles.detailField}
                placeholder="m²"
                value={area}
                onChangeText={setArea}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.detailInput}>
              <Ionicons name="car-outline" size={20} color="#666" />
              <TextInput
                style={styles.detailField}
                placeholder="Estacionamiento"
                value={parking}
                onChangeText={setParking}
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Descripción</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Describe tu propiedad, menciona características especiales, acabados, ubicación detallada, etc."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />
        </View>

        {/* Amenities */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Amenidades</Text>
          <View style={styles.chipsContainer}>
            {availableAmenities.map((amenity) => (
              <TouchableOpacity
                key={amenity}
                style={[
                  styles.chip,
                  amenities.includes(amenity) && styles.chipActive,
                ]}
                onPress={() => toggleAmenity(amenity)}
              >
                <Text
                  style={[
                    styles.chipText,
                    amenities.includes(amenity) && styles.chipTextActive,
                  ]}
                >
                  {amenity}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Publish Button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity 
          style={[styles.publishButton, uploading && styles.publishButtonDisabled]} 
          onPress={handlePublish}
          disabled={uploading}
        >
          {uploading ? (
            <>
              <ActivityIndicator color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.publishButtonText}>
                Subiendo imágenes... {Math.round(uploadProgress)}%
              </Text>
            </>
          ) : (
            <Text style={styles.publishButtonText}>Publicar Propiedad</Text>
          )}
        </TouchableOpacity>
      </View>
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
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    fontFamily: "System",
  },
  placeholder: {
    width: 36,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
    fontFamily: "System",
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
    fontFamily: "System",
  },
  required: {
    color: "#FF3B30",
  },
  imagesContainer: {
    flexDirection: "row",
  },
  addImageButton: {
    width: 120,
    height: 120,
    borderRadius: 12,
    backgroundColor: "#f8f9fa",
    borderWidth: 2,
    borderColor: "#e1e5e9",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  addImageText: {
    fontSize: 12,
    color: "#666",
    marginTop: 8,
    fontFamily: "System",
  },
  imagePreview: {
    width: 120,
    height: 120,
    borderRadius: 12,
    marginRight: 12,
    position: "relative",
  },
  previewImage: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
  removeImageButton: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "#FF3B30",
    borderRadius: 12,
  },
  input: {
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: "#333",
    fontFamily: "System",
  },
  textArea: {
    height: 120,
    paddingTop: 16,
  },
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e1e5e9",
  },
  chipActive: {
    backgroundColor: "#000",
    borderColor: "#000",
  },
  chipText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
    fontFamily: "System",
  },
  chipTextActive: {
    color: "#fff",
  },
  detailsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  detailInput: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flex: 1,
    minWidth: "45%",
    gap: 8,
  },
  detailField: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    fontFamily: "System",
  },
  bottomSpacing: {
    height: 100,
  },
  bottomBar: {
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
  publishButton: {
    backgroundColor: "#000",
    height: 50,
    borderRadius: 25,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  publishButtonDisabled: {
    backgroundColor: "#666",
    opacity: 0.7,
  },
  publishButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "System",
  },
});

