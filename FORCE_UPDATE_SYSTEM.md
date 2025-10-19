# Sistema de Actualización Forzada

Este sistema permite forzar a los usuarios a actualizar la app desde el backend, sin necesidad de modificar código.

## 🎯 Cómo Funciona

### 1. **Backend - Control de Versión**
El endpoint `GET /version` devuelve información sobre la versión requerida:

```json
{
  "currentVersion": "1.0.0",
  "minimumVersion": "1.0.0",
  "updateRequired": false,
  "updateUrl": "https://dealclick.app/download",
  "message": "Tu app está actualizada"
}
```

**Ubicación:** `backend/src/app/app.controller.ts`

### 2. **Frontend - Verificación al Inicio**
Al abrir la app, `_layout.tsx` verifica la versión contra el backend:
- Si `updateRequired: true` → Muestra pantalla de actualización forzada
- Si `updateRequired: false` → Continúa normalmente

**Ubicación:** `app/_layout.tsx`

### 3. **Pantalla de Actualización Forzada**
Pantalla bloqueante que obliga al usuario a actualizar antes de continuar.

**Ubicación:** `app/force-update.tsx`

---

## 🚀 Cómo Forzar una Actualización

### Escenario: Nueva versión 1.1.0 con cambios críticos

1. **Actualiza la versión en `app.json`:**
   ```json
   {
     "expo": {
       "version": "1.1.0"
     }
   }
   ```

2. **Publica la nueva versión** (App Store/Play Store o EAS Update)

3. **Actualiza el backend** para forzar la actualización:
   ```typescript
   // backend/src/app/app.controller.ts
   @Get('version')
   getVersion() {
     return {
       currentVersion: '1.1.0',      // Nueva versión disponible
       minimumVersion: '1.1.0',      // Versión mínima requerida
       updateRequired: true,         // ⚠️ FORZAR actualización
       updateUrl: 'https://dealclick.app/download',
       message: 'Hemos actualizado DealClick con mejoras importantes de seguridad.',
     };
   }
   ```

4. **Deploy el backend a Railway** (se hace automáticamente con git push)

### Resultado:
- ✅ Usuarios con versión < 1.1.0 verán pantalla de actualización
- ✅ No podrán usar la app hasta actualizar
- ✅ El mensaje personalizado les explica por qué

---

## 📱 Tipos de Actualización

### A. Actualización Opcional (Soft)
```typescript
{
  currentVersion: '1.1.0',
  minimumVersion: '1.0.0',    // Versión antigua aún funciona
  updateRequired: false,      // No forzar
  message: 'Hay una nueva versión con mejoras',
}
```
→ App funciona normalmente, pero puede mostrar un banner opcional

### B. Actualización Forzada (Hard)
```typescript
{
  currentVersion: '1.1.0',
  minimumVersion: '1.1.0',    // Versión antigua bloqueada
  updateRequired: true,       // ⚠️ FORZAR
  message: 'Actualización crítica de seguridad requerida',
}
```
→ App bloqueada hasta actualizar

---

## 🔄 Flujo Completo

```
Usuario abre app
    ↓
_layout.tsx llama GET /version
    ↓
Backend responde con versionData
    ↓
¿updateRequired: true?
    ↓
  SI → Pantalla de actualización forzada
        ↓
        Usuario hace clic en "Actualizar Ahora"
        ↓
        Se abre App Store/Play Store
        ↓
        Usuario actualiza
        ↓
        Abre app de nuevo
        ↓
        Nueva versión detectada
        ↓
        ✅ App funciona
    ↓
  NO → App continúa normalmente
       ↓
       Verifica OTA updates (Expo)
       ↓
       ✅ App funciona
```

---

## 📝 Ejemplos de Uso

### Ejemplo 1: Forzar actualización por bug crítico
```typescript
// backend/src/app/app.controller.ts
{
  currentVersion: '1.0.1',
  minimumVersion: '1.0.1',
  updateRequired: true,
  message: 'Hemos corregido un problema importante. Por favor actualiza.',
}
```

### Ejemplo 2: Cambio en API que rompe compatibilidad
```typescript
{
  currentVersion: '2.0.0',
  minimumVersion: '2.0.0',
  updateRequired: true,
  message: 'Nueva versión con mejoras importantes. La versión anterior ya no es compatible.',
}
```

### Ejemplo 3: Nueva función opcional
```typescript
{
  currentVersion: '1.2.0',
  minimumVersion: '1.0.0',
  updateRequired: false,
  message: 'Nueva versión disponible con filtros mejorados.',
}
```

---

## ⚙️ Configuración de URLs

Actualiza las URLs de las tiendas en `app/force-update.tsx`:

```typescript
const url = Platform.select({
  ios: 'https://apps.apple.com/app/dealclick/id123456789', // ← Tu App Store URL
  android: 'https://play.google.com/store/apps/details?id=com.dealclick', // ← Tu Play Store URL
  default: updateUrl,
});
```

---

## 🧪 Testing

### Probar actualización forzada en desarrollo:

1. **Cambia el backend** a `updateRequired: true`
2. **Reinicia la app** (no hot reload)
3. Deberías ver la pantalla de actualización forzada

### Logs para debugging:
```javascript
console.log('Current version:', APP_VERSION);
console.log('Minimum version required:', versionData.minimumVersion);
console.log('Update required:', versionData.updateRequired);
```

---

## 🎨 Personalización

### Cambiar mensaje de actualización:
Modifica el backend (`app.controller.ts`) para cambiar el mensaje sin publicar nueva versión de la app.

### Cambiar diseño de pantalla:
Edita `app/force-update.tsx` para cambiar colores, texto, iconos, etc.

---

## ⚠️ Notas Importantes

1. **No uses actualización forzada con frecuencia** - Solo para cambios críticos
2. **Siempre publica la nueva versión ANTES de cambiar updateRequired a true**
3. **Usa mensajes claros** que expliquen por qué es necesario actualizar
4. **Prueba en desarrollo** antes de aplicar en producción
5. **Ten un plan de rollback** si algo sale mal

---

## 📊 Versionado Recomendado

- **Patch (1.0.x):** Bug fixes → No forzar
- **Minor (1.x.0):** Nuevas funciones → No forzar (usualmente)
- **Major (x.0.0):** Cambios incompatibles → Forzar actualización

---

## 🔗 URLs y Enlaces

- **Backend Controller:** `backend/src/app/app.controller.ts`
- **Frontend Layout:** `app/_layout.tsx`
- **Pantalla de Actualización:** `app/force-update.tsx`
- **Versión:** `app.json` → `expo.version`
- **Constantes de Versión:** `constants/version.ts`

---

## 🆘 Troubleshooting

### "Version check failed" en logs
→ Backend no está accesible. Verifica Railway.

### Pantalla de actualización no aparece
→ Verifica que `updateRequired: true` en backend
→ Reinicia la app completamente (no hot reload)

### App bloqueada en testing
→ Cambia backend a `updateRequired: false`
→ Reinicia la app

