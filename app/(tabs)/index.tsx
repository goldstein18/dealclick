import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Keyboard, Modal, Pressable, RefreshControl, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { PropertyCard, RequirementCard } from "../../components";
import { useFeed } from "../../contexts/FeedContext";

export default function FeedScreen() {
  const { properties, requirements, loading, error, refreshFeed } = useFeed();
  const [activeSegment, setActiveSegment] = useState('properties');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  
  // Filter states for properties
  const [filtroTipo, setFiltroTipo] = useState('Todos');
  const [filtroPrecio, setFiltroPrecio] = useState('Todos');
  const [filtroUbicacion, setFiltroUbicacion] = useState('Todos');
  
  // Filter states for requirements
  const [filtroEstado, setFiltroEstado] = useState('Todos');
  const [filtroEspecialidad, setFiltroEspecialidad] = useState('Todas');
  const [filtroEmpresa, setFiltroEmpresa] = useState('Todas');

  // Filter data arrays
  const tiposPropiedad = ['Todos', 'Casa', 'Departamento', 'Oficina', 'Local', 'Terreno'];
  const rangosPrecio = ['Todos', 'Hasta $50M', '$50M - $100M', '$100M - $200M', 'Más de $200M'];
  const ubicaciones = ['Todos', 'Las Condes', 'Providencia', 'Ñuñoa', 'Santiago Centro', 'Vitacura', 'La Reina'];
  
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

  const handleSegmentPress = (segment: 'properties' | 'requirements') => {
    console.log('Switching to:', segment);
    setActiveSegment(segment);
  };

  const handleDropdownToggle = (dropdownName: string) => {
    setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
    setSearchText('');
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshFeed();
    setRefreshing(false);
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
      <View style={[
        styles.dropdownContainer,
        isOpen && styles.dropdownContainerActive
      ]}>
        <TouchableOpacity 
          style={[
            styles.dropdownButton,
            isOpen && styles.dropdownButtonActive
          ]} 
          onPress={onToggle}
        >
          <View style={styles.dropdownContent}>
            <Ionicons name="chevron-down" size={16} color={isOpen ? "#000" : "#666"} />
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

      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#000"
            colors={["#000"]}
          />
        }
      >
        {loading ? (
          // Loading State
          <View style={styles.loadingContainer}>
            <Ionicons name="refresh" size={32} color="#666" />
            <Text style={styles.loadingText}>Cargando datos...</Text>
          </View>
        ) : error ? (
          // Error State
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={32} color="#ff6b6b" />
            <Text style={styles.errorText}>Error al cargar los datos</Text>
            <Text style={styles.errorSubtext}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={refreshFeed}>
              <Text style={styles.retryButtonText}>Reintentar</Text>
            </TouchableOpacity>
          </View>
        ) : activeSegment === 'properties' ? (
          // Sección de Propiedades
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Propiedades Disponibles ({properties.length})</Text>
              <TouchableOpacity 
                style={styles.sectionFilterButton}
                onPress={() => setShowFilterModal(true)}
              >
                <Ionicons name="filter" size={18} color="#000" />
              </TouchableOpacity>
            </View>
            
            {properties.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="home-outline" size={48} color="#ccc" />
                <Text style={styles.emptyText}>No hay propiedades disponibles</Text>
                <Text style={styles.emptySubtext}>Sé el primero en publicar una propiedad</Text>
              </View>
            ) : (
              properties.map((property) => (
                <PropertyCard 
                  key={property.id}
                  property={property}
                  onPress={() => router.push(`/property/${property.id}`)}
                />
              ))
            )}
          </View>
        ) : (
          // Sección de Requerimientos
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Requerimientos Recientes ({requirements.length})</Text>
              <TouchableOpacity 
                style={styles.sectionFilterButton}
                onPress={() => setShowFilterModal(true)}
              >
                <Ionicons name="filter" size={18} color="#000" />
              </TouchableOpacity>
            </View>
            
            {requirements.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="document-text-outline" size={48} color="#ccc" />
                <Text style={styles.emptyText}>No hay requerimientos disponibles</Text>
                <Text style={styles.emptySubtext}>Sé el primero en publicar un requerimiento</Text>
              </View>
            ) : (
              requirements.map((requirement) => (
                <RequirementCard 
                  key={requirement.id}
                  requirement={requirement}
                  onUserPress={() => console.log('User pressed:', requirement.id)}
                />
              ))
            )}
          </View>
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => {
          if (activeSegment === 'properties') {
            router.push('/publish-property');
          } else {
            router.push('/publish-requirement');
          }
        }}
      >
        <Ionicons name="add" size={24} color="#fff" />
      </TouchableOpacity>

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
              <Text style={styles.modalTitle}>
                Filtrar {activeSegment === 'properties' ? 'Propiedades' : 'Requerimientos'}
              </Text>
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
              {activeSegment === 'properties' ? (
                // Property Filters
                <>
                  <View style={styles.filterSection}>
                    <Text style={styles.filterLabel}>Tipo de Propiedad</Text>
                    <SearchableDropdown
                      title="Tipo"
                      value={filtroTipo}
                      options={tiposPropiedad}
                      onSelect={setFiltroTipo}
                      isOpen={openDropdown === 'tipo'}
                      onToggle={() => handleDropdownToggle('tipo')}
                    />
                  </View>

                  <View style={styles.filterSection}>
                    <Text style={styles.filterLabel}>Rango de Precio</Text>
                    <SearchableDropdown
                      title="Precio"
                      value={filtroPrecio}
                      options={rangosPrecio}
                      onSelect={setFiltroPrecio}
                      isOpen={openDropdown === 'precio'}
                      onToggle={() => handleDropdownToggle('precio')}
                    />
                  </View>

                  <View style={styles.filterSection}>
                    <Text style={styles.filterLabel}>Ubicación</Text>
                    <SearchableDropdown
                      title="Ubicación"
                      value={filtroUbicacion}
                      options={ubicaciones}
                      onSelect={setFiltroUbicacion}
                      isOpen={openDropdown === 'ubicacion'}
                      onToggle={() => handleDropdownToggle('ubicacion')}
                    />
                  </View>
                </>
              ) : (
                // Requirements Filters
                <>
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
                </>
              )}
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={styles.clearButton}
                onPress={() => {
                  if (activeSegment === 'properties') {
                    setFiltroTipo('Todos');
                    setFiltroPrecio('Todos');
                    setFiltroUbicacion('Todos');
                  } else {
                    setFiltroEstado('Todos');
                    setFiltroEspecialidad('Todas');
                    setFiltroEmpresa('Todas');
                  }
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
    backgroundColor: "#f8f9fa",
  },

  segmentedControl: {
    flexDirection: "row",
    backgroundColor: "#f2f2f7",
    marginHorizontal: 20,
    marginTop: 10,
    borderRadius: 10,
    padding: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  segment: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 8,
  },
  activeSegment: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  segmentText: {
    fontSize: 15,
    color: "#8e8e93",
    fontWeight: "500",
  },
  activeSegmentText: {
    color: "#000",
    fontWeight: "600",
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginTop: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    flex: 1,
    fontFamily: "System",
  },
  sectionFilterButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#e1e5e9",
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
    color: "#000",
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
    color: "#000",
  },
  // Estilos para requerimientos
  requirementCard: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 20,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    marginRight: 14,
    borderWidth: 2,
    borderColor: "#f0f0f0",
  },
  requirementContent: {
    marginTop: 16,
  },
  requirementHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  userInfo: {
    flex: 1,
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  userHandle: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  time: {
    fontSize: 12,
    color: "#999",
    marginLeft: 4,
  },
  requirementText: {
    fontSize: 15,
    color: "#333",
    lineHeight: 22,
    marginBottom: 16,
  },
  requirementActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  whatsappButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 30,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
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
  // Dropdown styles
  dropdownContainer: {
    position: 'relative',
    zIndex: 1,
  },
  dropdownContainerActive: {
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
    borderWidth: 1,
  },
  dropdownContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropdownTitle: {
    fontSize: 12,
    color: '#666',
    marginLeft: 6,
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
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
}); 