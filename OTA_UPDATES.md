# Over-The-Air (OTA) Updates Guide

## 📱 Configuración Completada

La aplicación ahora está configurada para recibir actualizaciones Over-The-Air usando EAS Update.

## 🚀 Cómo Funciona

### Actualizaciones Automáticas
- La app verifica actualizaciones cada vez que se inicia
- Si hay una actualización disponible, se descarga automáticamente
- El usuario recibe una alerta para reiniciar la app
- Solo funciona en producción (no en desarrollo)

### Actualizaciones Manuales
- Los usuarios pueden verificar actualizaciones desde **Configuración** → **Aplicación** → **Buscar actualizaciones**
- Esto permite a los usuarios verificar e instalar actualizaciones bajo demanda

## 📝 Cómo Publicar Actualizaciones

### 1. Instalar EAS CLI (si no lo tienes)
```bash
npm install -g eas-cli
```

### 2. Login a tu cuenta de Expo
```bash
eas login
```

### 3. Publicar una actualización

**Para el canal de desarrollo:**
```bash
eas update --branch development --message "Descripción de los cambios"
```

**Para el canal de preview:**
```bash
eas update --branch preview --message "Descripción de los cambios"
```

**Para producción:**
```bash
eas update --branch production --message "Descripción de los cambios"
```

### 4. Verificar la actualización
```bash
eas update:list --branch production
```

## 🎯 Canales de Actualización

### Development
- Para testing interno
- Actualizaciones frecuentes
- No afecta a usuarios finales

### Preview
- Para testing con beta testers
- Actualizaciones semi-frecuentes
- Grupo limitado de usuarios

### Production
- Para usuarios finales
- Actualizaciones estables
- Todos los usuarios de la app en producción

## ⚙️ Configuración

### app.json
```json
{
  "updates": {
    "url": "https://u.expo.dev/[PROJECT-ID]",
    "enabled": true,
    "checkAutomatically": "ON_LOAD",
    "fallbackToCacheTimeout": 0
  },
  "runtimeVersion": {
    "policy": "appVersion"
  }
}
```

### Opciones de checkAutomatically:
- `ON_LOAD`: Verifica al iniciar la app (recomendado)
- `ON_ERROR_RECOVERY`: Solo verifica si hay un error
- `NEVER`: Nunca verifica automáticamente

## 🔄 Workflow Recomendado

1. **Desarrollo Local**
   ```bash
   npx expo start
   ```

2. **Publicar para Testing**
   ```bash
   eas update --branch preview --message "Nueva funcionalidad X"
   ```

3. **Testing con Beta Testers**
   - Los testers abren la app
   - Reciben la actualización automáticamente
   - Prueban la nueva funcionalidad

4. **Publicar a Producción**
   ```bash
   eas update --branch production --message "Release v1.1.0"
   ```

## 📊 Monitorear Actualizaciones

### Ver estadísticas de adopción:
```bash
eas update:view --branch production
```

### Ver todas las actualizaciones:
```bash
eas update:list
```

## ⚠️ Limitaciones

### Qué se puede actualizar con OTA:
✅ JavaScript/TypeScript
✅ Componentes React
✅ Estilos
✅ Assets (imágenes, fuentes, etc.)
✅ Configuración de la app
✅ Lógica de negocio

### Qué NO se puede actualizar con OTA:
❌ Cambios en código nativo (iOS/Android)
❌ Nuevos permisos nativos
❌ Nuevas dependencias nativas
❌ Cambios en app.json que requieren rebuild

Para estos casos, necesitas crear un nuevo build:
```bash
eas build --platform ios --profile production
eas build --platform android --profile production
```

## 🔒 Seguridad

- Las actualizaciones están firmadas digitalmente
- Solo se descargan desde servidores seguros de Expo
- Los usuarios pueden revertir a la versión embebida si hay problemas
- Las actualizaciones se verifican antes de aplicarse

## 📱 Experiencia del Usuario

1. Usuario abre la app
2. La app verifica actualizaciones en segundo plano
3. Si hay actualización:
   - Se descarga automáticamente
   - Usuario recibe alerta: "Actualización disponible"
   - Usuario toca "Reiniciar ahora"
   - App se reinicia con la nueva versión

## 🛠️ Comandos Útiles

```bash
# Ver información de la build actual
eas build:list

# Ver actualizaciones publicadas
eas update:list --branch production

# Eliminar una actualización
eas update:delete --group [GROUP-ID]

# Ver configuración del proyecto
eas project:info

# Ver logs de updates
eas update:view [UPDATE-ID]
```

## 📚 Recursos

- [EAS Update Documentation](https://docs.expo.dev/eas-update/introduction/)
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [Runtime Versions](https://docs.expo.dev/eas-update/runtime-versions/)

## 🎉 ¡Listo!

Ahora puedes publicar actualizaciones a tu app sin pasar por la App Store o Google Play Store.

