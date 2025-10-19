import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function PrivacyPolicyScreen() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Política de Privacidad</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Aviso de Privacidad Integral</Text>
        <Text style={styles.lastUpdated}>Última actualización: Octubre 2025</Text>

        <View style={styles.section}>
          <Text style={styles.companyInfo}>
            DealClick es una marca registrada de <Text style={styles.bold}>GOLDSTEIN SYSTEMS LTD</Text>
          </Text>
          <Text style={styles.companyDetails}>
            Número de Registro: 16402156{'\n'}
            Oficina Registrada: 71-75 Shelton Street, Covent Garden,{'\n'}
            London, United Kingdom, WC2H 9JQ
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>A. Identidad y Domicilio del Responsable</Text>
          <Text style={styles.paragraph}>
            En cumplimiento de las leyes de protección de datos aplicables, GOLDSTEIN SYSTEMS LTD 
            (en adelante, el "Responsable"), con número de registro 16402156 y oficina registrada 
            en 71-75 Shelton Street, Covent Garden, London, United Kingdom, WC2H 9JQ, le informa 
            expresamente lo siguiente:
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>B. Datos Personales Recabados y Sometidos a Tratamiento</Text>
          <Text style={styles.paragraph}>
            Para el desarrollo de las finalidades descritas en este Aviso de Privacidad, 
            recabamos las siguientes categorías de datos personales:
          </Text>
          <Text style={styles.bulletPoint}>• Datos de identificación y contacto</Text>
          <Text style={styles.bulletPoint}>• Datos personales</Text>
          <Text style={styles.bulletPoint}>• Datos sobre circunstancias sociales</Text>
          <Text style={styles.bulletPoint}>• Datos de información comercial</Text>
          <Text style={styles.bulletPoint}>• Datos de transacciones</Text>
          <Text style={styles.bulletPoint}>• Datos sobre situación jurídica</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>C. Tratamiento de Datos Personales Sensibles</Text>
          <Text style={styles.paragraph}>
            Para las finalidades señaladas en el apartado siguiente, el Responsable no recabará 
            datos personales sensibles.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>D. Finalidades del Tratamiento</Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>a) Finalidades primarias y necesarias:</Text>
          </Text>
          <Text style={styles.bulletPoint}>• Facilitar la contratación de los servicios ofrecidos por el Responsable</Text>
          <Text style={styles.bulletPoint}>• Gestionar, controlar, administrar y actualizar los datos personales de los clientes</Text>
          <Text style={styles.bulletPoint}>• Gestionar, controlar y administrar las comunicaciones entre el Responsable y sus clientes</Text>
          <Text style={styles.bulletPoint}>• Facturar los servicios prestados, así como su cobranza judicial o extrajudicial</Text>
          <Text style={styles.bulletPoint}>• Realizar un registro histórico y estadístico de clientes</Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>b) Finalidades adicionales:</Text>
          </Text>
          <Text style={styles.bulletPoint}>• Enviar comunicaciones informativas relacionadas con los servicios proporcionados</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>E. Transferencias de Datos Personales</Text>
          <Text style={styles.paragraph}>
            Sus datos personales podrán ser transferidos y tratados por personas distintas al 
            Responsable en los siguientes casos:
          </Text>
          <Text style={styles.bulletPoint}>
            • Empresas controladoras, subsidiarias o afiliadas del Responsable para 
            resguardo centralizado de información
          </Text>
          <Text style={styles.bulletPoint}>
            • Autoridades gubernamentales en cumplimiento de obligaciones establecidas 
            en la legislación aplicable
          </Text>
          <Text style={styles.paragraph}>
            En los demás casos, sus datos personales no serán transferidos a terceros sin su 
            consentimiento, salvo las excepciones previstas en el Artículo 37 de la LFPDPPP.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>F. Ejercicio de Derechos ARCO</Text>
          <Text style={styles.paragraph}>
            En todos los casos legalmente procedentes, usted podrá ejercer sus derechos de 
            Acceso, Rectificación, Cancelación y Oposición (ARCO) mediante los procedimientos 
            que hemos implementado.
          </Text>
          <Text style={styles.paragraph}>
            La solicitud deberá contener:
          </Text>
          <Text style={styles.bulletPoint}>• Su nombre y domicilio u otro medio para comunicarle la respuesta</Text>
          <Text style={styles.bulletPoint}>• Los documentos que acrediten su identidad o representación legal</Text>
          <Text style={styles.bulletPoint}>• La descripción clara y precisa de los datos respecto de los que busca ejercer alguno de los derechos ARCO</Text>
          <Text style={styles.bulletPoint}>• Cualquier otro elemento o documento que facilite la localización de los datos personales</Text>
          <Text style={styles.paragraph}>
            El Responsable le comunicará la determinación adoptada en un plazo máximo de 20 
            (veinte) días hábiles contados desde la fecha en que se recibió la solicitud. 
            Para más información, contacte a nuestro soporte técnico.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>G. Revocación del Consentimiento</Text>
          <Text style={styles.paragraph}>
            Usted podrá revocar su consentimiento para el tratamiento de sus datos personales, 
            sin efectos retroactivos, siempre que dicha revocación no implique la imposibilidad 
            de cumplir obligaciones derivadas de una relación jurídica vigente entre usted y el 
            Responsable.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>H. Limitación de Uso y Divulgación de Datos</Text>
          <Text style={styles.paragraph}>
            Usted puede limitar el uso o divulgación de sus datos personales dirigiendo la 
            solicitud correspondiente a nuestro Departamento de Datos Personales.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>I. Medios Automáticos para Recabar Datos Personales</Text>
          <Text style={styles.paragraph}>
            El Responsable utiliza cookies para facilitar la navegación en la aplicación. 
            Los servicios electrónicos que presta el Responsable permiten la recopilación, 
            análisis y conservación de información técnica relacionada con los hábitos de uso 
            de dichos servicios.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>J. Modificaciones al Aviso de Privacidad</Text>
          <Text style={styles.paragraph}>
            El Responsable podrá modificar, actualizar, ampliar o de cualquier otra forma 
            cambiar el contenido y alcance del presente Aviso de Privacidad en cualquier 
            momento y a su entera discreción. En tales casos, publicaremos dichos cambios 
            en la aplicación DealClick.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contacto</Text>
          <Text style={styles.paragraph}>
            Para cualquier consulta sobre este Aviso de Privacidad, puede contactarnos a través 
            de nuestro soporte técnico en WhatsApp: +44 7561 019183
          </Text>
          <Text style={styles.companyDetails}>
            <Text style={styles.bold}>GOLDSTEIN SYSTEMS LTD</Text>{'\n'}
            Número de Registro: 16402156{'\n'}
            71-75 Shelton Street, Covent Garden{'\n'}
            London, United Kingdom{'\n'}
            WC2H 9JQ
          </Text>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eff3f4',
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f1419',
    fontFamily: 'System',
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0f1419',
    marginBottom: 8,
    fontFamily: 'System',
  },
  lastUpdated: {
    fontSize: 13,
    color: '#536471',
    marginBottom: 24,
    fontFamily: 'System',
  },
  companyInfo: {
    fontSize: 15,
    color: '#0f1419',
    textAlign: 'center',
    marginBottom: 12,
    fontFamily: 'System',
  },
  companyDetails: {
    fontSize: 13,
    color: '#536471',
    textAlign: 'center',
    lineHeight: 20,
    fontFamily: 'System',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f1419',
    marginBottom: 12,
    fontFamily: 'System',
  },
  paragraph: {
    fontSize: 15,
    color: '#0f1419',
    lineHeight: 24,
    marginBottom: 12,
    fontFamily: 'System',
  },
  bulletPoint: {
    fontSize: 15,
    color: '#0f1419',
    lineHeight: 24,
    marginLeft: 8,
    marginBottom: 8,
    fontFamily: 'System',
  },
  bold: {
    fontWeight: '700',
  },
  bottomSpacing: {
    height: 60,
  },
});

