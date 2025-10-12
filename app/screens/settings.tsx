import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Image, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
import { checkForManualUpdate } from "../../utils/updates";

export default function SettingsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  const SettingItem = ({ 
    icon, 
    title, 
    subtitle, 
    onPress, 
    rightElement, 
    showChevron = true 
  }: {
    icon: string;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    rightElement?: React.ReactNode;
    showChevron?: boolean;
  }) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={styles.settingLeft}>
        <View style={styles.iconContainer}>
          <Ionicons name={icon as any} size={22} color="#000" />
        </View>
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      <View style={styles.settingRight}>
        {rightElement}
        {showChevron && (
          <Ionicons name="chevron-forward" size={16} color="#C7C7CC" />
        )}
      </View>
    </TouchableOpacity>
  );

  const SettingSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Configuración</Text>
      </View>

      {/* Profile Section */}
      <View style={styles.profileSection}>
        <Image 
          source={{ uri: 'https://i.pravatar.cc/100?img=1' }} 
          style={styles.profileImage} 
        />
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>María González</Text>
          <Text style={styles.profileSubtitle}>Agente Inmobiliario</Text>
        </View>
        <TouchableOpacity style={styles.qrButton}>
          <Ionicons name="qr-code-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Account Section */}
      <SettingSection title="CUENTA">
        <SettingItem
          icon="person-outline"
          title="Perfil"
          subtitle="Información personal y foto"
        />
        <SettingItem
          icon="key-outline"
          title="Privacidad y seguridad"
          subtitle="Bloqueo de pantalla, privacidad"
        />
        <SettingItem
          icon="shield-checkmark-outline"
          title="Verificación de identidad"
          subtitle="Verificar tu perfil profesional"
        />
      </SettingSection>

      {/* Preferences Section */}
      <SettingSection title="PREFERENCIAS">
        <SettingItem
          icon="notifications-outline"
          title="Notificaciones"
          subtitle="Gestionar notificaciones"
          rightElement={
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: "#E5E5EA", true: "#34C759" }}
              thumbColor={notificationsEnabled ? "#fff" : "#fff"}
            />
          }
          showChevron={false}
        />
        <SettingItem
          icon="location-outline"
          title="Ubicación"
          subtitle="Compartir ubicación para propiedades cercanas"
          rightElement={
            <Switch
              value={locationEnabled}
              onValueChange={setLocationEnabled}
              trackColor={{ false: "#E5E5EA", true: "#34C759" }}
              thumbColor={locationEnabled ? "#fff" : "#fff"}
            />
          }
          showChevron={false}
        />
        <SettingItem
          icon="moon-outline"
          title="Modo oscuro"
          subtitle="Cambiar tema de la aplicación"
          rightElement={
            <Switch
              value={darkModeEnabled}
              onValueChange={setDarkModeEnabled}
              trackColor={{ false: "#E5E5EA", true: "#34C759" }}
              thumbColor={darkModeEnabled ? "#fff" : "#fff"}
            />
          }
          showChevron={false}
        />
        <SettingItem
          icon="language-outline"
          title="Idioma"
          subtitle="Español"
        />
      </SettingSection>

      {/* App Section */}
      <SettingSection title="APLICACIÓN">
        <SettingItem
          icon="chatbubbles-outline"
          title="Chats"
          subtitle="Tema, historial, copias de seguridad"
        />
        <SettingItem
          icon="camera-outline"
          title="Fotos y medios"
          subtitle="Descarga automática, calidad"
        />
        <SettingItem
          icon="storage-outline"
          title="Almacenamiento y datos"
          subtitle="Uso de datos, almacenamiento"
        />
        <SettingItem
          icon="cloud-download-outline"
          title="Buscar actualizaciones"
          subtitle="Verificar e instalar nuevas versiones"
          onPress={checkForManualUpdate}
        />
        <SettingItem
          icon="help-circle-outline"
          title="Ayuda"
          subtitle="Centro de ayuda, contactanos"
        />
      </SettingSection>

      {/* Business Section */}
      <SettingSection title="NEGOCIO">
        <SettingItem
          icon="business-outline"
          title="Mi negocio"
          subtitle="Gestionar mi perfil profesional"
        />
        <SettingItem
          icon="analytics-outline"
          title="Estadísticas"
          subtitle="Ver métricas de mi perfil"
        />
        <SettingItem
          icon="card-outline"
          title="Métodos de pago"
          subtitle="Tarjetas y facturación"
        />
        <SettingItem
          icon="document-text-outline"
          title="Contratos y documentos"
          subtitle="Plantillas y documentos legales"
        />
      </SettingSection>

      {/* Support Section */}
      <SettingSection title="SOPORTE">
        <SettingItem
          icon="information-circle-outline"
          title="Acerca de"
          subtitle="Versión 1.0.0"
        />
        <SettingItem
          icon="star-outline"
          title="Calificar aplicación"
          subtitle="Califica en la App Store"
        />
        <SettingItem
          icon="share-outline"
          title="Compartir aplicación"
          subtitle="Invita a otros agentes"
        />
      </SettingSection>

      {/* Logout */}
      <View style={styles.logoutSection}>
        <TouchableOpacity style={styles.logoutButton}>
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  header: {
    backgroundColor: "#fff",
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#000",
    fontFamily: "System",
  },
  profileSection: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    marginBottom: 2,
    fontFamily: "System",
  },
  profileSubtitle: {
    fontSize: 14,
    color: "#8E8E93",
    fontFamily: "System",
  },
  qrButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F2F2F7",
    justifyContent: "center",
    alignItems: "center",
  },
  section: {
    marginTop: 32,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#8E8E93",
    marginBottom: 8,
    marginHorizontal: 20,
    letterSpacing: 0.5,
    fontFamily: "System",
  },
  settingItem: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#E5E5EA",
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F2F2F7",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    color: "#000",
    fontWeight: "400",
    fontFamily: "System",
  },
  settingSubtitle: {
    fontSize: 13,
    color: "#8E8E93",
    marginTop: 2,
    fontFamily: "System",
  },
  settingRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoutSection: {
    marginTop: 32,
    paddingHorizontal: 20,
  },
  logoutButton: {
    backgroundColor: "#fff",
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  logoutText: {
    fontSize: 16,
    color: "#FF3B30",
    fontWeight: "600",
    fontFamily: "System",
  },
  bottomSpacing: {
    height: 40,
  },
});

