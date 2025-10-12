import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from "react";
import { FlatList, Keyboard, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import type { AdvisorData } from "../../components";
import { AdvisorCard } from "../../components";
import { advisorsAPI } from "../../services/api";

// Helper function to transform API data to component format
const transformAdvisorData = (apiAdvisor: any): AdvisorData => ({
  id: apiAdvisor.id,
  nombre: apiAdvisor.nombre || 'Asesor',
  empresa: apiAdvisor.empresa || 'Independiente',
  imagen: apiAdvisor.imagen || require('../../assets/images/frontlogo.png'),
  ubicacion: apiAdvisor.ubicacion || 'Ubicación no especificada',
  especialidad: apiAdvisor.especialidad || 'General',
  calificacion: apiAdvisor.calificacion || 4.0,
  propiedades: apiAdvisor.propiedades || 0,
  fechaRegistro: apiAdvisor.createdAt ? new Date(apiAdvisor.createdAt).toLocaleDateString() : undefined
});

const estados = [
  'Todos', 'Aguascalientes', 'Baja California', 'Baja California Sur', 'Campeche', 
  'Chiapas', 'Chihuahua', 'CDMX', 'Coahuila', 'Colima', 'Durango', 'Edo. Mex', 
  'Guanajuato', 'Guerrero', 'Hidalgo', 'Jalisco', 'Michoacán', 'Morelos', 
  'Nayarit', 'Nuevo León', 'Oaxaca', 'Puebla', 'Querétaro', 'Quintana Roo', 
  'San Luis Potosí', 'Sinaloa', 'Sonora', 'Tabasco', 'Tamaulipas', 'Tlaxcala', 
  'Veracruz', 'Yucatán', 'Zacatecas'
];

const especialidades = ['Todas', 'Residencial', 'Comercial', 'Industrial', 'Terrenos', 'Oficinas'];
const empresas = [
  'Todas', 'RE/MAX', 'Century 21', 'Keller Williams', 'Engel & Völkers', 
  'Coldwell Banker', 'Sotheby\'s', 'Berkshire Hathaway', 'Compass', 'Redfin',
  'Zillow', 'Trulia', 'Realty ONE Group', 'Better Homes and Gardens',
  'ERA Real Estate', 'Long & Foster', 'Howard Hanna', 'HomeServices of America'
];

function AdvisorItem({ item }: { item: AdvisorData }) {
  return (
    <AdvisorCard 
      advisor={item}
      onPress={() => router.push('/profile')}
    />
  );
}


export default function AdvisorsScreen() {
  const [filtroNombre, setFiltroNombre] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('Todos');
  const [filtroEspecialidad, setFiltroEspecialidad] = useState('Todas');
  const [filtroEmpresa, setFiltroEmpresa] = useState('Todas');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('');
  
  // API state
  const [advisors, setAdvisors] = useState<AdvisorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAdvisors = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Loading advisors from API...');
      
      const response = await advisorsAPI.getAll({
        search: filtroNombre || undefined,
        estado: filtroEstado !== 'Todos' ? filtroEstado : undefined,
        especialidad: filtroEspecialidad !== 'Todas' ? filtroEspecialidad : undefined,
        empresa: filtroEmpresa !== 'Todas' ? filtroEmpresa : undefined,
      });
      
      console.log('Advisors response:', response);
      
      const transformedAdvisors = response.data?.map(transformAdvisorData) || [];
      setAdvisors(transformedAdvisors);
      
      console.log('Advisors loaded successfully');
    } catch (err: any) {
      console.error('Error loading advisors:', err);
      setError(err.response?.data?.message || 'Error al cargar los asesores');
      setAdvisors([]);
    } finally {
      setLoading(false);
    }
  };

  // Load advisors on mount and when filters change
  useEffect(() => {
    loadAdvisors();
  }, [filtroNombre, filtroEstado, filtroEspecialidad, filtroEmpresa]);

  const handleDropdownToggle = (dropdownName: string) => {
    setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
    setSearchText('');
  };

  const SearchableDropdown = ({ 
    title, 
    value, 
    options, 
    onSelect, 
    isOpen, 
    onToggle 
  }: {
    title: string;
    value: string;
    options: string[];
    onSelect: (value: string) => void;
    isOpen: boolean;
    onToggle: () => void;
  }) => {
    const filteredOptions = options.filter(option =>
      option.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
      <View style={[styles.dropdownContainer, isOpen && styles.dropdownContainerActive]}>
        <TouchableOpacity 
          style={[
            styles.dropdownButton,
            isOpen && styles.dropdownButtonActive
          ]} 
          onPress={onToggle}
        >
          <View style={styles.dropdownContent}>
            <Text style={styles.dropdownTitle}>{title}</Text>
            <Text style={[styles.dropdownValue, isOpen && styles.dropdownValueActive]}>
              {value}
            </Text>
          </View>
          <Ionicons 
            name={isOpen ? "chevron-up" : "chevron-down"} 
            size={16} 
            color={isOpen ? "#000" : "#666"} 
          />
        </TouchableOpacity>
        
        {isOpen && (
          <View style={styles.dropdownPanel}>
            <View style={styles.dropdownSearchContainer}>
              <Ionicons name="search" size={16} color="#666" />
              <TextInput
                style={styles.dropdownSearchInput}
                placeholder={`Buscar ${title.toLowerCase()}...`}
                value={searchText}
                onChangeText={setSearchText}
                autoFocus
              />
            </View>
            
            <ScrollView style={styles.optionsList} showsVerticalScrollIndicator={false}>
              {filteredOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.dropdownOption,
                    value === option && styles.dropdownOptionSelected
                  ]}
                  onPress={() => {
                    onSelect(option);
                    onToggle();
                    setSearchText('');
                  }}
                >
                  <Text style={[
                    styles.dropdownOptionText,
                    value === option && styles.dropdownOptionTextSelected
                  ]}>
                    {option}
                  </Text>
                  {value === option && (
                    <Ionicons name="checkmark" size={16} color="#fff" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </View>
    );
  };


  return (
    <View style={styles.container}>
      {/* Header with Search */}
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar asesores..."
            value={filtroNombre}
            onChangeText={setFiltroNombre}
          />
          <TouchableOpacity 
            style={styles.filterButton}
            onPress={() => setShowFilterModal(true)}
          >
            <Ionicons name="filter" size={20} color="#000" />
          </TouchableOpacity>
        </View>
      </View>


      {/* Advisors List */}
      <FlatList
        data={advisors}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => <AdvisorItem item={item} />}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        refreshing={loading}
        onRefresh={loadAdvisors}
        ListEmptyComponent={
          loading ? (
            <View style={styles.loadingContainer}>
              <Ionicons name="refresh" size={32} color="#666" />
              <Text style={styles.loadingText}>Cargando asesores...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={32} color="#ff6b6b" />
              <Text style={styles.errorText}>Error al cargar asesores</Text>
              <Text style={styles.errorSubtext}>{error}</Text>
              <TouchableOpacity style={styles.retryButton} onPress={loadAdvisors}>
                <Text style={styles.retryButtonText}>Reintentar</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="people-outline" size={48} color="#ccc" />
              <Text style={styles.emptyText}>No se encontraron asesores</Text>
              <Text style={styles.emptySubtext}>Intenta ajustar los filtros</Text>
            </View>
          )
        }
      />

      {/* Filter Modal */}
      <Modal
        visible={showFilterModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowFilterModal(false)}
      >
        <Pressable 
          style={styles.modalOverlay}
          onPress={() => {
            Keyboard.dismiss();
            setShowFilterModal(false);
          }}
        >
          <Pressable 
            style={styles.modalContent}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filtrar Asesores</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setShowFilterModal(false)}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView 
              style={styles.modalBody}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ paddingBottom: 20 }}
            >
              {/* Estado Filter */}
              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Estado</Text>
                <SearchableDropdown
                  title="Estado"
                  value={filtroEstado}
                  options={estados}
                  onSelect={setFiltroEstado}
                  isOpen={openDropdown === 'estado'}
                  onToggle={() => handleDropdownToggle('estado')}
                />
              </View>

              {/* Especialidad Filter */}
              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Especialidad</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipContainer}>
                  {especialidades.map((especialidad) => (
                    <TouchableOpacity
                      key={especialidad}
                      style={[
                        styles.filterChip,
                        filtroEspecialidad === especialidad && styles.filterChipActive
                      ]}
                      onPress={() => setFiltroEspecialidad(especialidad)}
                    >
                      <Text style={[
                        styles.filterChipText,
                        filtroEspecialidad === especialidad && styles.filterChipTextActive
                      ]}>
                        {especialidad}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* Empresa Filter */}
              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Empresa</Text>
                <SearchableDropdown
                  title="Empresa"
                  value={filtroEmpresa}
                  options={empresas}
                  onSelect={setFiltroEmpresa}
                  isOpen={openDropdown === 'empresa'}
                  onToggle={() => handleDropdownToggle('empresa')}
                />
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={styles.clearButton}
                onPress={() => {
                  setFiltroEstado('Todos');
                  setFiltroEspecialidad('Todas');
                  setFiltroEmpresa('Todas');
                }}
              >
                <Text style={styles.clearButtonText}>Limpiar Filtros</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.applyButton}
                onPress={() => setShowFilterModal(false)}
              >
                <Text style={styles.applyButtonText}>Aplicar</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#fff',
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e5e9',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#e1e5e9',
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  filterButton: {
    padding: 8,
    marginLeft: 8,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  advisorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
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
  },
  advisorInfo: {
    flex: 1,
  },
  nameRow: {
    marginBottom: 4,
  },
  nombre: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  empresa: {
    fontSize: 14,
    color: '#000',
    fontWeight: '600',
    marginBottom: 8,
  },
  detailsRow: {
    flexDirection: 'row',
    marginBottom: 8,
    gap: 12,
  },
  locationChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  locationText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  specialtyChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  specialtyText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  dateText: {
    fontSize: 12,
    color: '#999',
    marginLeft: 4,
  },
  contactButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  separator: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '50%',
    minHeight: '40%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e5e9',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    flex: 1,
    paddingHorizontal: 20,
  },
  filterSection: {
    marginVertical: 16,
  },
  dropdownContainer: {
    position: 'relative',
    zIndex: 1,
  },
  dropdownContainerActive: {
    position: 'relative',
    zIndex: 9999,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#e1e5e9',
  },
  dropdownButtonActive: {
    backgroundColor: '#fff',
    borderColor: '#000',
    borderWidth: 2,
  },
  dropdownContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropdownTitle: {
    fontSize: 12,
    color: '#666',
    marginRight: 8,
  },
  dropdownValue: {
    fontSize: 13,
    color: '#333',
    fontWeight: '600',
    flex: 1,
  },
  dropdownValueActive: {
    color: '#000',
  },
  dropdownPanel: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e1e5e9',
    marginTop: 4,
    zIndex: 10000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 20,
    maxHeight: 300,
  },
  dropdownSearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dropdownSearchInput: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
    paddingVertical: 4,
  },
  optionsList: {
    maxHeight: 200,
  },
  dropdownOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dropdownOptionSelected: {
    backgroundColor: '#000',
  },
  dropdownOptionText: {
    fontSize: 14,
    color: '#333',
  },
  dropdownOptionTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  chipContainer: {
    flexDirection: 'row',
  },
  filterChip: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e1e5e9',
  },
  filterChipActive: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  filterChipText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  modalFooter: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#e1e5e9',
    gap: 12,
  },
  clearButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e1e5e9',
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  applyButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#000',
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  // Loading and Error States
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ff6b6b',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  errorSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#000',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 