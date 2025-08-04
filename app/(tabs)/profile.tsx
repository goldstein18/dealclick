import React, { useState } from "react";
import { View, Text, TextInput, Button, Image, TouchableOpacity, StyleSheet, ScrollView, Platform, FlatList } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

const EMPRESAS = [
  "Century 21",
  "RE/MAX",
  "Keller Williams",
  "Coldwell Banker",
  "Engel & Völkers",
  "Otra"
];

const propiedadesSimuladas = [
  { id: '1', imagen: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80' },
  { id: '2', imagen: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80' },
  { id: '3', imagen: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=400&q=80' },
];

export default function ProfileScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [nombre, setNombre] = useState("Asesor Inmobiliario");
  const [bio, setBio] = useState("Especialista en bienes raíces con más de 10 años de experiencia.");
  const [especialidades, setEspecialidades] = useState("Residencial, Comercial");
  const [email, setEmail] = useState("asesor@email.com");
  const [telefono, setTelefono] = useState("555-123-4567");
  const [empresa, setEmpresa] = useState(EMPRESAS[0]);
  const [editando, setEditando] = useState(false);

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
      quality: 0.5,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSave = () => {
    setEditando(false);
    alert("Perfil guardado correctamente (simulado)");
  };

  // Simulación de estadísticas
  const propiedadesCount = propiedadesSimuladas.length;
  const reseniasRecibidas = 18;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Fila superior: foto + stats */}
      <View style={styles.topRow}>
        <Image
          source={{ uri: image || 'https://randomuser.me/api/portraits/men/32.jpg' }}
          style={styles.avatar}
        />
        <View style={styles.statsCol}>
          <Text style={styles.nombre}>{nombre}</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{propiedadesCount}</Text>
              <Text style={styles.statLabel}>Publicaciones</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{reseniasRecibidas}</Text>
              <Text style={styles.statLabel}>Reseñas recibidas</Text>
            </View>
          </View>
        </View>
      </View>
      {/* Bio debajo de la foto */}
      <Text style={styles.bio}>{bio}</Text>
      {/* Chips de especialidad */}
      <View style={styles.chipsContainer}>
        {especialidades.split(',').map((esp, idx) => (
          <View key={idx} style={styles.chip}>
            <Text style={styles.chipText}>{esp.trim()}</Text>
          </View>
        ))}
      </View>
      {/* Botones de contacto */}
      <View style={styles.contactButtonsRow}>
        <View style={styles.contactButton}>
          <MaterialIcons name="email" size={18} color="#C35139" style={{ marginRight: 6 }} />
          <Text style={styles.contactButtonText}>{email}</Text>
        </View>
        <View style={styles.contactButton}>
          <Ionicons name="call" size={18} color="#C35139" style={{ marginRight: 6 }} />
          <Text style={styles.contactButtonText}>{telefono}</Text>
        </View>
        <View style={styles.contactButton}>
          <MaterialIcons name="business" size={18} color="#C35139" style={{ marginRight: 6 }} />
          <Text style={styles.contactButtonText}>{empresa}</Text>
        </View>
      </View>
      {editando && (
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Nombre completo"
            value={nombre}
            onChangeText={setNombre}
          />
          <TextInput
            style={[styles.input, { height: 60 }]}
            placeholder="Biografía"
            value={bio}
            onChangeText={setBio}
            multiline
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
          <Text style={styles.label}>Empresa inmobiliaria</Text>
          {EMPRESAS.map((e) => (
            <TouchableOpacity
              key={e}
              style={empresa === e ? styles.selectedEmpresa : styles.empresaBtn}
              onPress={() => setEmpresa(e)}
            >
              <Text>{e}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      <Text style={styles.gridTitle}>Propiedades</Text>
      <FlatList
        data={propiedadesSimuladas}
        keyExtractor={item => item.id}
        numColumns={3}
        contentContainerStyle={styles.grid}
        renderItem={({ item }) => (
          <Image source={{ uri: item.imagen }} style={styles.gridImage} />
        )}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    paddingBottom: 32,
  },
  header: {
    alignItems: "center",
    marginTop: 32,
    marginBottom: 16,
    width: "100%",
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "#eee",
    alignSelf: "center",
  },
  nombre: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "left",
    alignSelf: "flex-start",
    fontFamily: 'System',
  },
  bio: {
    fontSize: 15,
    color: "#444",
    marginBottom: 8,
    textAlign: "center",
    paddingHorizontal: 24,
    alignSelf: "center",
    fontFamily: 'System',
  },
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 8,
    gap: 6,
    alignSelf: "center",
  },
  chip: {
    backgroundColor: "#e6f0ff",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
    margin: 2,
  },
  chipText: {
    color: "#C35139",
    fontWeight: "bold",
    fontSize: 13,
    fontFamily: 'System',
  },
  empresa: {
    fontWeight: "bold",
    color: "#161e42",
    marginBottom: 2,
    textAlign: "center",
    alignSelf: "center",
    fontFamily: 'System',
  },
  contacto: {
    color: "#666",
    marginBottom: 2,
    textAlign: "center",
    alignSelf: "center",
    fontFamily: 'System',
  },
  form: {
    width: "92%",
    marginVertical: 16,
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 16,
    alignSelf: "center",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    backgroundColor: "#fafafa",
  },
  label: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  empresaBtn: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: "#f5f5f5",
  },
  selectedEmpresa: {
    width: "100%",
    padding: 10,
    borderWidth: 2,
    borderColor: "#C35139",
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: "#e6f0ff",
  },
  gridTitle: {
    fontWeight: "bold",
    fontSize: 18,
    marginTop: 24,
    marginBottom: 8,
    alignSelf: "flex-start",
    marginLeft: 16,
  },
  grid: {
    alignItems: "flex-start",
    justifyContent: "center",
    marginBottom: 32,
    paddingHorizontal: 0,
  },
  gridImage: {
    width: 120,
    height: 120,
    margin: 2,
    borderRadius: 8,
    backgroundColor: "#eee",
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 32,
    marginBottom: 16,
    width: "100%",
    paddingHorizontal: 16,
  },
  statsCol: {
    flex: 1,
    marginLeft: 20,
    justifyContent: "center",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginTop: 0,
    gap: 0,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 2,
    fontFamily: 'System',
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    fontFamily: 'System',
  },
  contactButtonsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 16,
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  contactButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#eee",
  },
  contactButtonText: {
    fontSize: 14,
    color: "#C35139",
    fontWeight: "bold",
    fontFamily: 'System',
  },
}); 