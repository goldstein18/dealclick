# 🔍 Cómo Funciona la Detección Automática de Versión

## ✅ **SÍ, detecta automáticamente la versión del usuario**

El sistema compara **2 versiones**:
1. **Versión del usuario** (la que tiene instalada en su celular)
2. **Versión mínima requerida** (la que configuras en Railway)

---

## 📊 **Lógica del Sistema**

```javascript
Usuario abre app
    ↓
App lee su propia versión: "1.0.0" (de app.json)
    ↓
App consulta backend: GET /version
    ↓
Backend responde:
    {
      currentVersion: "1.2.0",      // Última versión disponible
      minimumVersion: "1.1.0",      // Versión mínima aceptada
      updateRequired: false          // Forzar a todos (true/false)
    }
    ↓
App compara:
    ¿ 1.0.0 < 1.1.0 ?  → SÍ, está desactualizado
    ↓
    🚨 MUESTRA PANTALLA DE ACTUALIZACIÓN
```

---

## 🎯 **Dos Modos de Activación**

### **Modo 1: Comparación Inteligente (Automático)**
```
MINIMUM_APP_VERSION=1.1.0
FORCE_UPDATE=false
```

**Resultado:**
- ✅ Usuario con 1.0.0 → Ve pantalla (automático)
- ✅ Usuario con 1.0.5 → Ve pantalla (automático)
- ✅ Usuario con 1.1.0 → Puede usar app
- ✅ Usuario con 1.2.0 → Puede usar app

**Uso:** Cuando publicas versión nueva y quieres que los usuarios antiguos actualicen.

---

### **Modo 2: Forzar a Todos (Manual)**
```
FORCE_UPDATE=true
```

**Resultado:**
- 🚨 TODOS los usuarios ven pantalla (sin importar versión)

**Uso:** Emergencias, cambios críticos, testing.

---

## 🧮 **Ejemplos de Comparación**

| Usuario tiene | Mínimo requerido | ¿Actualizar? | Razón |
|---------------|------------------|--------------|-------|
| 1.0.0 | 1.0.0 | ❌ No | Igual → OK |
| 1.0.0 | 1.0.1 | ✅ Sí | Menor → Desactualizado |
| 1.0.0 | 1.1.0 | ✅ Sí | Menor → Desactualizado |
| 1.1.0 | 1.0.0 | ❌ No | Mayor → OK |
| 1.2.5 | 1.1.0 | ❌ No | Mayor → OK |
| 2.0.0 | 1.9.9 | ❌ No | Mayor → OK |

---

## 📱 **Escenarios Reales**

### **Escenario 1: Acabas de Lanzar (Versión 1.0.0)**

**En app.json:**
```json
"version": "1.0.0"
```

**En Railway:**
```
APP_VERSION=1.0.0
MINIMUM_APP_VERSION=1.0.0
FORCE_UPDATE=false
```

**Resultado:**
- ✅ Todos los usuarios con 1.0.0 pueden usar la app
- ✅ No hay actualizaciones forzadas

---

### **Escenario 2: Publicas Bug Fix (Versión 1.0.1)**

**1. Actualizas app.json:**
```json
"version": "1.0.1"
```

**2. Publicas a App Store/Play Store**

**3. En Railway cambias:**
```
APP_VERSION=1.0.1
MINIMUM_APP_VERSION=1.0.1
FORCE_UPDATE=false
```

**Resultado:**
- 🚨 Usuarios con 1.0.0 → Ven pantalla (automático por versión)
- ✅ Usuarios con 1.0.1 → Pueden usar app

---

### **Escenario 3: Cambio No Crítico (Versión 1.1.0)**

**1. Actualizas app.json:**
```json
"version": "1.1.0"
```

**2. Publicas a App Store/Play Store**

**3. En Railway SOLO cambias la versión actual, NO la mínima:**
```
APP_VERSION=1.1.0
MINIMUM_APP_VERSION=1.0.0    ← No cambias
FORCE_UPDATE=false
```

**Resultado:**
- ✅ Usuarios con 1.0.0 → Pueden seguir usando (no es crítico)
- ✅ Usuarios con 1.0.5 → Pueden seguir usando
- ✅ Usuarios con 1.1.0 → Usan la nueva versión
- 💡 Backend sabe que 1.1.0 existe, pero no obliga a actualizar

---

### **Escenario 4: Cambio Crítico (Versión 1.2.0)**

**1. Actualizas app.json:**
```json
"version": "1.2.0"
```

**2. Publicas a App Store/Play Store**

**3. En Railway:**
```
APP_VERSION=1.2.0
MINIMUM_APP_VERSION=1.2.0    ← Cambias aquí
FORCE_UPDATE=false
```

**Resultado:**
- 🚨 Usuarios con 1.0.0 → Pantalla de actualización
- 🚨 Usuarios con 1.1.0 → Pantalla de actualización
- ✅ Usuarios con 1.2.0 → Pueden usar app

---

### **Escenario 5: Emergencia (Bug Crítico)**

**En Railway:**
```
FORCE_UPDATE=true    ← Activas ESTO
```

**Resultado:**
- 🚨 **TODOS** los usuarios ven pantalla (sin importar versión)
- Útil para mantenimiento urgente o testing

**Para desactivar:**
```
FORCE_UPDATE=false
```

---

## 🎛️ **Control Granular**

Puedes decidir:

### **A) Actualización Opcional**
```
APP_VERSION=1.1.0
MINIMUM_APP_VERSION=1.0.0    ← Versión antigua aún funciona
```
→ Usuarios pueden quedarse en 1.0.0

### **B) Actualización Gradual**
```
APP_VERSION=1.2.0
MINIMUM_APP_VERSION=1.1.0    ← Solo bloqueas las MÁS antiguas
```
→ 1.0.0 se bloquea, pero 1.1.0+ funciona

### **C) Actualización Forzada Total**
```
APP_VERSION=1.2.0
MINIMUM_APP_VERSION=1.2.0    ← Solo la última funciona
```
→ Solo 1.2.0 puede usar la app

---

## 📝 **Logs para Debugging**

Cuando abras la app, verás en consola:

```
📱 Current app version: 1.0.0
☁️ Latest version: 1.2.0
⚠️ Minimum version required: 1.1.0
🔒 Force update enabled: false
🔍 Version comparison: {
  current: "1.0.0",
  minimum: "1.1.0",
  isOutdated: true,           ← El usuario ESTÁ desactualizado
  shouldUpdate: true          ← DEBE actualizar
}
```

---

## 🧪 **Cómo Probar**

### **Test 1: Usuario Desactualizado**

**Railway:**
```
MINIMUM_APP_VERSION=2.0.0    ← Versión alta
FORCE_UPDATE=false
```

**Tu app.json tiene:** `1.0.0`

**Resultado:** 🚨 Verás pantalla (porque 1.0.0 < 2.0.0)

---

### **Test 2: Usuario Actualizado**

**Railway:**
```
MINIMUM_APP_VERSION=1.0.0    ← Versión igual o menor
FORCE_UPDATE=false
```

**Tu app.json tiene:** `1.0.0`

**Resultado:** ✅ App funciona normal (porque 1.0.0 >= 1.0.0)

---

### **Test 3: Forzar a Todos**

**Railway:**
```
FORCE_UPDATE=true
```

**Resultado:** 🚨 Verás pantalla (sin importar versión)

---

## 💡 **Resumen Simple**

**Pregunta:** ¿Detecta automáticamente la versión del usuario?

**Respuesta:** ✅ **SÍ**

1. **Automático:** Si usuario tiene 1.0.0 y pones `MINIMUM_APP_VERSION=1.1.0`, se bloquea automáticamente
2. **Manual:** Si pones `FORCE_UPDATE=true`, bloqueas a TODOS sin importar versión
3. **Combinado:** Puedes usar ambos para máximo control

---

## 🎯 **Flujo Típico de Producción**

```bash
# 1. Lanzas app (día 1)
app.json: "version": "1.0.0"
Railway: MINIMUM_APP_VERSION=1.0.0

# 2. Bug fix (semana 2)
app.json: "version": "1.0.1"
Railway: MINIMUM_APP_VERSION=1.0.1  ← Usuarios con 1.0.0 se bloquean

# 3. Nueva función (mes 2)
app.json: "version": "1.1.0"
Railway: MINIMUM_APP_VERSION=1.0.1  ← Usuarios con 1.0.1+ siguen funcionando

# 4. Cambio de API (mes 6)
app.json: "version": "2.0.0"
Railway: MINIMUM_APP_VERSION=2.0.0  ← SOLO 2.0.0 funciona

# 5. Emergencia
Railway: FORCE_UPDATE=true  ← Bloqueas a TODOS instantáneamente
```

---

**¿Dudas?** El sistema es automático e inteligente. Solo configura `MINIMUM_APP_VERSION` y se encarga de todo. 🚀

