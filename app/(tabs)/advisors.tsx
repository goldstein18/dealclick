import React, { useState } from "react";
import { View, Text, FlatList, Image, StyleSheet, TextInput, TouchableOpacity, Animated, Pressable } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const asesoresData = [
  {
    id: '1',
    nombre: 'Ana López',
    empresa: 'RE/MAX',
    foto: 'https://randomuser.me/api/portraits/women/44.jpg',
    fechaRegistro: '2023-01-15',
    estado: 'CDMX',
    especialidad: 'Residencial',
  },
  {
    id: '2',
    nombre: 'Carlos Pérez',
    empresa: 'Century 21',
    foto: 'https://randomuser.me/api/portraits/men/45.jpg',
    fechaRegistro: '2022-11-10',
    estado: 'Edo. Mex',
    especialidad: 'Comercial',
  },
  {
    id: '3',
    nombre: 'María García',
    empresa: 'Keller Williams',
    foto: 'https://randomuser.me/api/portraits/women/46.jpg',
    fechaRegistro: '2023-03-05',
    estado: 'CDMX',
    especialidad: 'Residencial',
  },
  {
    id: '4',
    nombre: 'Luis Torres',
    empresa: 'Engel & Völkers',
    foto: 'https://randomuser.me/api/portraits/men/47.jpg',
    fechaRegistro: '2022-12-20',
    estado: 'Jalisco',
    especialidad: 'Industrial',
  },
];

const estados = ['Todos', 'CDMX', 'Edo. Mex', 'Jalisco'];
const especialidades = ['Todas', 'Residencial', 'Comercial', 'Industrial'];
const empresas = ['Todas', ...Array.from(new Set(asesoresData.map(a => a.empresa)))];

function FresaCard({ item }: { item: typeof asesoresData[0] }) {
  const scale = useState(new Animated.Value(1))[0];
  return (
    <Pressable
      onPressIn={() => Animated.spring(scale, { toValue: 0.97, useNativeDriver: true }).start()}
      onPressOut={() => Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start()}
      style={{ marginBottom: 36 }}
    >
      <Animated.View style={[styles.cardShadow, { transform: [{ scale }] }]}
      >
        <View style={styles.cardContent}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarGlowWrap}>
              <Image source={{ uri: item.foto }} style={styles.avatar} />
            </View>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.nombre}>{item.nombre}</Text>
            <Text style={styles.empresa}>{item.empresa}</Text>
            <View style={styles.separator} />
            <View style={styles.chipRow}>
              <View style={styles.chipEstado}>
                <Text style={styles.chipText}>{item.estado}</Text>
              </View>
              <View style={styles.chipEspecialidad}>
                <Text style={styles.chipText}>{item.especialidad}</Text>
              </View>
            </View>
            <View style={styles.metaRow}>
              <Ionicons name="calendar-outline" size={15} color="#b0b0b0" style={{ marginRight: 4 }} />
              <Text style={styles.meta}>{item.fechaRegistro}</Text>
            </View>
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
}

export default function AdvisorsScreen() {
  const [filtroNombre, setFiltroNombre] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('Todos');
  const [filtroEspecialidad, setFiltroEspecialidad] = useState('Todas');
  const [filtroEmpresa, setFiltroEmpresa] = useState('Todas');

  const asesoresFiltrados = asesoresData.filter(a =>
    (filtroNombre === '' || a.nombre.toLowerCase().includes(filtroNombre.toLowerCase())) &&
    (filtroEstado === 'Todos' || a.estado === filtroEstado) &&
    (filtroEspecialidad === 'Todas' || a.especialidad === filtroEspecialidad) &&
    (filtroEmpresa === 'Todas' || a.empresa === filtroEmpresa)
  );

  return (
    <View style={{ flex: 1 }}>
      {/* Filtros arriba */}
      <View style={styles.filtrosContainer}>
        <TextInput
          style={styles.input}
          placeholder="Buscar por nombre"
          value={filtroNombre}
          onChangeText={setFiltroNombre}
        />
        <FlatList
          data={estados}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={item === filtroEstado ? styles.filtroActivo : styles.filtro}
              onPress={() => setFiltroEstado(item)}
            >
              <Text style={item === filtroEstado ? styles.filtroActivoText : styles.filtroText}>{item}</Text>
            </TouchableOpacity>
          )}
        />
        <FlatList
          data={especialidades}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={item === filtroEspecialidad ? styles.filtroActivo : styles.filtro}
              onPress={() => setFiltroEspecialidad(item)}
            >
              <Text style={item === filtroEspecialidad ? styles.filtroActivoText : styles.filtroText}>{item}</Text>
            </TouchableOpacity>
          )}
        />
        <FlatList
          data={empresas}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={item === filtroEmpresa ? styles.filtroActivo : styles.filtro}
              onPress={() => setFiltroEmpresa(item)}
            >
              <Text style={item === filtroEmpresa ? styles.filtroActivoText : styles.filtroText}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
      <FlatList
        data={asesoresFiltrados}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.container}
        renderItem={({ item }) => <FresaCard item={item} />}
        ListEmptyComponent={<Text style={{ marginTop: 32, textAlign: 'center' }}>No se encontraron asesores.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f6f8fa',
  },
  filtrosContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
  },
  input: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    backgroundColor: '#fafafa',
    fontSize: 15,
  },
  filtro: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#eee',
    marginRight: 8,
    marginBottom: 8,
  },
  filtroActivo: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#C35139',
    marginRight: 8,
    marginBottom: 8,
  },
  filtroText: {
    color: '#222',
    fontWeight: '500',
    fontFamily: 'System',
  },
  filtroActivoText: {
    color: '#fff',
    fontWeight: 'bold',
    fontFamily: 'System',
  },
  cardShadow: {
    borderRadius: 32,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
    borderWidth: 1,
    borderColor: '#f2f2f2',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderRadius: 32,
    padding: 28,
  },
  avatarContainer: {
    borderRadius: 50,
    backgroundColor: '#fff',
    padding: 0,
    marginRight: 28,
    shadowColor: '#fff',
    shadowOpacity: 0.7,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 0 },
    elevation: 2,
  },
  avatarGlowWrap: {
    borderRadius: 50,
    padding: 3,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#eaeaea',
    shadowColor: '#fff',
    shadowOpacity: 0.5,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
    elevation: 2,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 1.5,
    borderColor: '#eaeaea',
  },
  infoContainer: {
    flex: 1,
  },
  nombre: {
    fontWeight: '700',
    fontSize: 22,
    marginBottom: 2,
    color: '#222',
    letterSpacing: 0.1,
    fontFamily: 'System',
  },
  empresa: {
    color: '#C35139',
    fontWeight: '700',
    marginBottom: 10,
    fontSize: 18,
    letterSpacing: 0.2,
    fontFamily: 'System',
  },
  separator: {
    height: 1,
    backgroundColor: '#f2f2f2',
    marginVertical: 10,
    borderRadius: 1,
  },
  chipRow: {
    flexDirection: 'row',
    marginBottom: 10,
    gap: 10,
  },
  chipEstado: {
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 5,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#eaeaea',
    backgroundColor: '#fff',
  },
  chipEspecialidad: {
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: '#eaeaea',
    backgroundColor: '#fff',
  },
  chipText: {
    fontWeight: '500',
    fontSize: 14,
    color: '#444',
    fontFamily: 'System',
    letterSpacing: 0.1,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  meta: {
    color: '#b0b0b0',
    fontSize: 13,
    fontFamily: 'System',
    marginLeft: 2,
  },
}); 