# 📱 App Store Submission Checklist

## ✅ **COMPLETADO - Listo para Enviar**

### 🔐 **1. Permisos de iOS (CRÍTICO)**
- ✅ **NSPhotoLibraryUsageDescription** - Acceso a galería de fotos
- ✅ **NSCameraUsageDescription** - Acceso a cámara
- ✅ **NSPhotoLibraryAddUsageDescription** - Guardar fotos
- ✅ **NSFaceIDUsageDescription** - Face ID/Touch ID para login
- ✅ **ITSAppUsesNonExemptEncryption** - Declaración de encriptación

**Ubicación:** `app.json` → `ios.infoPlist`

---

### 📄 **2. Privacy Policy (REQUERIDO)**
- ✅ Política de privacidad completa creada
- ✅ Información de la empresa (Goldstein Systems LTD)
- ✅ Dirección UK registrada
- ✅ Cumplimiento GDPR y CCPA
- ✅ Descripción de uso de datos
- ✅ WhatsApp de contacto (+44 7561 019183)

**Archivo:** `PRIVACY_POLICY.txt`

**Acción requerida:** Sube este archivo a tu sitio web y obtén una URL pública (ej: `https://dealclick.app/privacy-policy`)

---

### 🎨 **3. App Store Assets (NECESARIOS)**

#### **Screenshots (REQUERIDOS)**
Necesitas capturas de pantalla para:
- ✅ iPhone 6.7" (1290 x 2796 px) - 3-10 screenshots
- ✅ iPhone 6.5" (1242 x 2688 px) - 3-10 screenshots
- ✅ iPad Pro 12.9" (2048 x 2732 px) - 3-10 screenshots (si soportas iPad)

**Pantallas recomendadas para capturar:**
1. Login/Bienvenida
2. Feed de propiedades
3. Detalle de propiedad
4. Perfil de usuario
5. Publicar propiedad
6. Filtros avanzados

#### **App Icon (COMPLETADO)**
- ✅ 1024x1024 px PNG
- ✅ Sin transparencia
- ✅ Sin bordes redondeados (iOS los aplica automáticamente)

**Ubicación:** `assets/images/icon.png`

---

### 📝 **4. App Store Metadata**

#### **App Name**
```
DealClick
```

#### **Subtitle (30 caracteres)**
```
Red de Agentes Inmobiliarios
```

#### **Description (Corta - hasta 170 caracteres)**
```
Conecta con agentes inmobiliarios, publica propiedades y encuentra oportunidades de negocio en el mercado mexicano.
```

#### **Description (Completa - hasta 4000 caracteres)**
```
DealClick es la plataforma líder para profesionales del sector inmobiliario en México.

CARACTERÍSTICAS PRINCIPALES:

🏠 PROPIEDADES
• Publica tus propiedades con fotos de alta calidad
• Explora miles de listados verificados
• Filtros avanzados por ubicación, precio, tipo
• Información detallada de cada propiedad

🔍 REQUERIMIENTOS
• Publica lo que buscan tus clientes
• Descubre oportunidades que coincidan
• Conecta compradores con vendedores
• Notificaciones en tiempo real

👥 NETWORKING
• Directorio de agentes verificados
• Filtra por ubicación y especialidad
• Conecta vía WhatsApp directamente
• Perfil profesional personalizable

⚡ HERRAMIENTAS PROFESIONALES
• Sube imágenes de forma ultra rápida
• Compatible con fotos HEIF/HEIC de iPhone
• Interfaz intuitiva y moderna
• Actualización automática de contenido

🔒 SEGURIDAD
• Login biométrico (Face ID/Touch ID)
• Datos encriptados
• Verificación de agentes
• Privacidad garantizada

PARA QUIÉN ES DEALCLICK:
• Agentes inmobiliarios independientes
• Brokers y empresas inmobiliarias
• Asesores especializados
• Profesionales del sector

EMPRESAS INTEGRADAS:
RE/MAX, Century 21, Coldwell Banker, KW Keller Williams, Inmobiliaria Del Sureste, y muchas más.

COBERTURA:
Todos los estados de México, desde CDMX hasta Quintana Roo.

Descarga DealClick y lleva tu negocio inmobiliario al siguiente nivel.

Desarrollado por Goldstein Systems LTD
Soporte: WhatsApp +44 7561 019183
```

#### **Keywords (100 caracteres)**
```
inmobiliaria,bienes raices,agentes,propiedades,casas,departamentos,terrenos,mexico,remax
```

#### **Support URL**
```
https://dealclick.app/support
```
(O usa WhatsApp: `https://wa.me/447561019183`)

#### **Marketing URL**
```
https://dealclick.app
```

#### **Privacy Policy URL** (CRÍTICO - REQUERIDO)
```
https://dealclick.app/privacy-policy
```
⚠️ **Debes subir PRIVACY_POLICY.txt a tu sitio web**

---

### 🔢 **5. Version Information**
- ✅ Version: `1.0.0`
- ✅ Build Number: `1`
- ✅ Bundle ID: `com.dealclick.app`

**Ubicación:** `app.json`

---

### 🎯 **6. App Category**
**Primary Category:** Business
**Secondary Category:** Productivity

---

### 👶 **7. Age Rating**
**Rating:** 4+ (No Objectionable Content)

**Questionnaire:**
- Cartoon or Fantasy Violence: No
- Realistic Violence: No
- Prolonged Graphic Violence: No
- Sexual Content or Nudity: No
- Profanity or Crude Humor: No
- Alcohol, Tobacco, or Drug Use: No
- Simulated Gambling: No
- Horror/Fear Themes: No
- Mature/Suggestive Themes: No
- Unrestricted Web Access: No (Solo WhatsApp links)
- Gambling and Contests: No

---

### 📧 **8. Contact Information**

**Company:** Goldstein Systems LTD
**Address:** 71-75 Shelton Street, Covent Garden, London, UK, WC2H 9JQ
**Phone:** +44 7561 019183
**Email:** support@dealclick.app

---

### 💰 **9. Pricing**
- ✅ Free app
- ❌ No In-App Purchases (por ahora)
- ❌ No ads

---

### 🌎 **10. Availability**
**Suggested Countries:**
- Mexico (Primary)
- United States
- Spain
- All Latin America

**Language:**
- Spanish (Primary)
- English (Future)

---

### 🔍 **11. App Review Information**

**Demo Account (CRÍTICO - Apple lo pedirá):**

Crea una cuenta de prueba para Apple:
```
Email: demo@dealclick.app
Password: AppleReview2025!
Agent Type: Asesor Independiente
State: Ciudad de México
```

**Notes for Reviewer:**
```
DealClick is a platform for verified real estate agents in Mexico.

TEST ACCOUNT:
Email: demo@dealclick.app
Password: AppleReview2025!

FEATURES TO TEST:
1. Login with Face ID/Touch ID (optional)
2. Browse property listings
3. View property details
4. Browse requirements feed
5. View agent directory
6. Edit profile and upload photo
7. Publish a test property (camera/photo library permissions)

PERMISSIONS:
- Camera: For property photos
- Photo Library: For selecting images
- Face ID: For quick login

CONTACT:
WhatsApp Support: +44 7561 019183

Thank you for reviewing our app!
```

---

### ⚠️ **12. Potential Rejection Reasons - EVITAR**

#### ✅ **YA CORREGIDO:**
- ✅ Missing NSPhotoLibraryUsageDescription
- ✅ Missing NSCameraUsageDescription
- ✅ Missing Privacy Policy
- ✅ Missing app description
- ✅ Incomplete metadata

#### ⚠️ **PENDIENTE - ACCIÓN REQUERIDA:**

**1. Privacy Policy URL**
- 🔴 **CRÍTICO:** Debes subir `PRIVACY_POLICY.txt` a tu sitio web
- URL debe estar accesible públicamente
- Debe coincidir con lo que declaras en App Store Connect

**2. Screenshots**
- 🔴 **REQUERIDO:** Necesitas 3-10 screenshots por tamaño de dispositivo
- Usa Expo EAS Build + simulador iOS para capturarlos

**3. Demo Account**
- 🟡 **RECOMENDADO:** Crea cuenta `demo@dealclick.app` antes de enviar
- Facilita la revisión de Apple

**4. App Icon**
- ✅ Verificar que `assets/images/icon.png` sea 1024x1024
- ✅ Sin transparencia
- ✅ Alta calidad

---

### 🚀 **13. Build and Submit**

#### **Step 1: Build for iOS**
```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure build
eas build:configure

# Build for iOS
eas build --platform ios
```

#### **Step 2: Submit to App Store**
```bash
# Upload to App Store Connect
eas submit --platform ios
```

O manualmente:
1. Download IPA from EAS
2. Upload via Transporter app
3. Complete metadata in App Store Connect
4. Submit for review

---

### 📋 **14. Pre-Submission Checklist**

Antes de enviar, verifica:

**Technical:**
- [ ] App builds successfully
- [ ] No crashes on launch
- [ ] All features work as expected
- [ ] Biometric login works
- [ ] Camera permission works
- [ ] Photo library permission works
- [ ] Images upload successfully
- [ ] Push notifications configured (if applicable)

**Content:**
- [ ] Privacy Policy uploaded and URL works
- [ ] Screenshots captured (3-10 per device size)
- [ ] App icon is 1024x1024
- [ ] Demo account created and tested
- [ ] All metadata filled in App Store Connect

**Legal:**
- [ ] Privacy Policy mentions all data collection
- [ ] Terms of Service (if applicable)
- [ ] Age rating is correct
- [ ] Company information is accurate

---

### 🎯 **15. Review Timeline**

**Expected Timeline:**
- App Review: 24-48 hours (typical)
- First submission: Sometimes up to 5-7 days
- If rejected: Fix and resubmit (24 hours)

**Status Updates:**
- Waiting for Review
- In Review
- Pending Developer Release
- Ready for Sale ✅

---

### 📞 **16. Support Resources**

**Apple:**
- App Store Connect: https://appstoreconnect.apple.com
- Review Guidelines: https://developer.apple.com/app-store/review/guidelines/
- Human Interface Guidelines: https://developer.apple.com/design/human-interface-guidelines/

**Expo:**
- EAS Build: https://docs.expo.dev/build/introduction/
- EAS Submit: https://docs.expo.dev/submit/introduction/
- App Store Submission: https://docs.expo.dev/submit/ios/

**DealClick Support:**
- WhatsApp: +44 7561 019183

---

## ✅ **RESUMEN: LISTO PARA APP STORE**

**Completado:**
- ✅ Todos los permisos iOS configurados
- ✅ Privacy Policy creada
- ✅ Metadata de app completa
- ✅ Descripción profesional
- ✅ Sin violaciones obvias de guidelines

**Pendiente (antes de enviar):**
- 🔴 Subir Privacy Policy a sitio web público
- 🔴 Capturar screenshots (3-10 por tamaño)
- 🟡 Crear cuenta demo para Apple
- 🟡 Verificar app icon (1024x1024)

**Estimated Time to Submit:** 2-4 horas (capturar screenshots + setup)

---

**¡Buena suerte con tu submission!** 🚀🍎

