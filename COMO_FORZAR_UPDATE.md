# 🚀 Guía Rápida: Cómo Forzar Actualización

## 📱 **Método 1: Desde Railway (SIN DEPLOY - Más Rápido)**

### Paso 1: Ve a Railway
1. Abre [railway.app](https://railway.app)
2. Selecciona tu proyecto DealClick
3. Click en el servicio `backend`
4. Ve a la pestaña **Variables**

### Paso 2: Agrega las Variables de Entorno

Agrega estas 4 variables uevas:

```
FORCE_UPDATE=true
APP_VERSION=1.0.0
MINIMUM_APP_VERSION=1.0.0
UPDATE_MESSAGE=Actualización crítica requerida. Por favor actualiza DealClick.
```

**Importante:**
- `FORCE_UPDATE=true` → Activa la actualización forzada ⚠️
- `FORCE_UPDATE=false` → Desactiva la actualización forzada ✅
- Puedes cambiar `UPDATE_MESSAGE` para personalizar el mensaje

### Paso 3: Railway Redeploy Automático
Railway reiniciará automáticamente el backend con las nuevas variables.

### Paso 4: Verifica que Funcione
Abre la app (cierra y abre de nuevo, no hot reload) y deberías ver la pantalla de actualización.

---

## 🔧 **Método 2: Cambiar Código y Deploy**

Si prefieres tener control en código:

### Paso 1: Edita `backend/src/app/app.controller.ts`

```typescript
@Get('version')
getVersion() {
  return {
    currentVersion: '1.0.0',
    minimumVersion: '1.0.0',
    updateRequired: true,  // ← Cambia a true
    updateUrl: 'https://dealclick.app/download',
    message: 'Actualización crítica requerida',  // ← Personaliza
  };
}
```

### Paso 2: Commit y Push
```bash
git add backend/src/app/app.controller.ts
git commit -m "Force update to v1.0.0"
git push origin main
```

### Paso 3: Railway Deploy Automático
Railway desplegará automáticamente en ~2 minutos.

---

## 📊 **Escenarios de Uso**

### Escenario A: Testing (Probar que Funciona)
**Railway Variables:**
```
FORCE_UPDATE=true
MINIMUM_APP_VERSION=1.0.0
UPDATE_MESSAGE=Prueba de actualización - ignorar
```

**Resultado:** Todos verán pantalla de actualización

---

### Escenario B: Nueva Versión Crítica (1.1.0)
**Primero actualiza app.json:**
```json
{
  "expo": {
    "version": "1.1.0"  // ← Nueva versión
  }
}
```

**Luego en Railway:**
```
FORCE_UPDATE=true
APP_VERSION=1.1.0
MINIMUM_APP_VERSION=1.1.0
UPDATE_MESSAGE=Nueva versión con mejoras importantes de seguridad.
```

**Resultado:** Solo usuarios con < 1.1.0 verán pantalla

---

### Escenario C: Desactivar Actualización Forzada
**Railway Variables:**
```
FORCE_UPDATE=false
```

**Resultado:** Todos pueden usar la app normalmente

---

## ⚡ **Comparación de Métodos**

| Método | Velocidad | Deploy Necesario | Control en Tiempo Real |
|--------|-----------|------------------|------------------------|
| **Railway Variables** | ⚡ Inmediato | ❌ No | ✅ Sí |
| **Cambiar Código** | 🕐 ~2 min | ✅ Sí | ❌ No |

**Recomendación:** Usa Railway Variables para máxima flexibilidad.

---

## 🧪 **Probar AHORA (Testing Rápido)**

### Para ver la pantalla de actualización inmediatamente:

1. **Ve a Railway** → Backend → Variables
2. **Agrega:** `FORCE_UPDATE=true`
3. **Espera 30 segundos** (Railway reinicia)
4. **En tu celular:** Cierra la app completamente
5. **Abre la app de nuevo**
6. **Deberías ver:** Pantalla de actualización forzada 🎉

### Para desactivar:

1. **Railway** → Backend → Variables
2. **Cambia:** `FORCE_UPDATE=false`
3. **Espera 30 segundos**
4. **Abre la app** → Funcionará normal

---

## 🎯 **Flujo Recomendado para Producción**

### Cuando publiques una nueva versión:

```
1. Actualiza app.json → version: "1.1.0"
2. Build y publica a App Store/Play Store
3. Espera aprobación de las tiendas
4. Una vez aprobada, ve a Railway:
   - APP_VERSION=1.1.0
   - MINIMUM_APP_VERSION=1.1.0
   - FORCE_UPDATE=true
   - UPDATE_MESSAGE=Nueva versión disponible con mejoras importantes
5. Los usuarios verán la pantalla de actualización
6. Después de unos días, cambia FORCE_UPDATE=false
```

---

## 📝 **Variables Explicadas**

| Variable | Ejemplo | Descripción |
|----------|---------|-------------|
| `FORCE_UPDATE` | `true` o `false` | Activa/desactiva actualización forzada |
| `APP_VERSION` | `1.1.0` | Versión más reciente disponible |
| `MINIMUM_APP_VERSION` | `1.0.0` | Versión mínima que puede usar la app |
| `UPDATE_MESSAGE` | `"Texto personalizado"` | Mensaje que ve el usuario |

---

## ⚠️ **Importante**

1. **Siempre publica la app ANTES de activar FORCE_UPDATE**
2. **Prueba en desarrollo primero**
3. **Usa mensajes claros y amigables**
4. **No fuerces actualizaciones con frecuencia**
5. **Ten un plan de rollback** (FORCE_UPDATE=false)

---

## 🆘 **Troubleshooting**

### "No veo la pantalla de actualización"
- ✅ Verifica que `FORCE_UPDATE=true` en Railway
- ✅ Cierra la app COMPLETAMENTE y ábrela de nuevo
- ✅ Espera 30 segundos después de cambiar variables
- ✅ Verifica logs: Railway → Deployments → View Logs

### "Backend no responde"
- ✅ Verifica que Railway esté corriendo
- ✅ Prueba: `curl https://tu-backend.railway.app/version`

### "Quiero desactivarlo urgentemente"
- ✅ Railway → Variables → `FORCE_UPDATE=false`
- ✅ Espera 30 segundos → Listo

---

## 🎓 **Ejemplo Completo**

Supongamos que detectas un bug crítico y necesitas que todos actualicen YA:

```bash
# Paso 1: Arregla el bug y actualiza versión en app.json
"version": "1.0.1"

# Paso 2: Publica a App Store/Play Store
eas build --platform all
eas submit --platform all

# Paso 3: Una vez aprobada, ve a Railway y agrega:
FORCE_UPDATE=true
APP_VERSION=1.0.1
MINIMUM_APP_VERSION=1.0.1
UPDATE_MESSAGE=Hemos corregido un problema importante. Actualiza ahora.

# Paso 4: Todos los usuarios verán la pantalla de actualización
# Paso 5: Después de unos días:
FORCE_UPDATE=false  # Para dejar de forzar
```

---

## 🔍 **Verificar Estado Actual**

Para ver qué está devolviendo el backend:

```bash
curl https://dealclick-production.up.railway.app/version
```

Deberías ver algo como:
```json
{
  "currentVersion": "1.0.0",
  "minimumVersion": "1.0.0",
  "updateRequired": false,
  "updateUrl": "https://dealclick.app/download",
  "message": "Tu app está actualizada"
}
```

---

**¿Necesitas ayuda?** Lee `FORCE_UPDATE_SYSTEM.md` para documentación completa.

