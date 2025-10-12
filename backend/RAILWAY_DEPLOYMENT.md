# 🚂 Railway Deployment Guide - DealClick Backend

Guía completa para hacer deploy del backend de DealClick en Railway.

---

## 🎯 Por qué Railway?

✅ **Fácil y rápido** - Deploy en 5 minutos  
✅ **Gratis para empezar** - $5 crédito gratis/mes  
✅ **Auto-deploy** desde GitHub  
✅ **Variables de entorno** fáciles de configurar  
✅ **Logs en tiempo real**  
✅ **HTTPS automático**  
✅ **Base de datos PostgreSQL** integrada (si la necesitas)  

---

## 📋 Prerrequisitos

1. ✅ Cuenta en GitHub
2. ✅ Cuenta en Railway (https://railway.app/)
3. ✅ Backend funcionando localmente
4. ✅ Credenciales de Backblaze B2
5. ✅ Credenciales de Supabase

---

## 🚀 Paso 1: Preparar el repositorio

### 1.1 Inicializar Git (si no lo has hecho)

```bash
cd backend
git init
git add .
git commit -m "Initial commit - DealClick Backend"
```

### 1.2 Crear repositorio en GitHub

1. Ve a https://github.com/new
2. Nombre: `dealclick-backend`
3. Privado o Público (tu eliges)
4. **NO** inicialices con README
5. Click "Create repository"

### 1.3 Conectar y subir

```bash
git remote add origin https://github.com/TU_USUARIO/dealclick-backend.git
git branch -M main
git push -u origin main
```

---

## 🚂 Paso 2: Deploy en Railway

### 2.1 Crear nuevo proyecto

1. Ve a https://railway.app/
2. Click **"New Project"**
3. Selecciona **"Deploy from GitHub repo"**
4. Autoriza Railway a acceder a GitHub
5. Selecciona el repositorio `dealclick-backend`
6. Click **"Deploy Now"**

### 2.2 Railway detectará automáticamente

- ✅ Node.js
- ✅ NestJS
- ✅ TypeScript
- ✅ Build command: `npm run build`
- ✅ Start command: `npm run start:prod`

---

## ⚙️ Paso 3: Configurar Variables de Entorno

### 3.1 En el dashboard de Railway

1. Click en tu proyecto
2. Click en la pestaña **"Variables"**
3. Click **"New Variable"**
4. Agrega cada variable:

```env
NODE_ENV=production
PORT=3000

# Supabase Database
DB_HOST=aws-0-us-east-1.pooler.supabase.com
DB_PORT=6543
DB_USERNAME=postgres.nheefvchtxtetadwiwin
DB_PASSWORD=BABAsali25!gold
DB_NAME=postgres

# Supabase API
SUPABASE_URL=https://nheefvchtxtetadwiwin.supabase.co
SUPABASE_ANON_KEY=sb_publishable_l6Dw7FOk_Wj7UejxhMJ3lw_SLBrwpzC
SUPABASE_SERVICE_KEY=sb_secret_DtaTGRdp8BsnrlKAwpV3iw_gGh41bVn

# JWT
JWT_SECRET=tu-secret-key-super-seguro-cambiar-esto-en-produccion
JWT_EXPIRATION=30d

# CORS (Agrega tu dominio de producción)
CORS_ORIGIN=*

# Backblaze B2 Storage
B2_APPLICATION_KEY_ID=bade40672800
B2_APPLICATION_KEY=0059ef78255ab8ae9ba06899ac963654325ac4e211
B2_BUCKET_ID=0b1aaddeb490d66792980010
B2_BUCKET_NAME=dealclick-images
B2_CDN_URL=https://f000.backblazeb2.com/file/dealclick-images
```

⚠️ **IMPORTANTE:** Cambia `JWT_SECRET` por un valor único y seguro en producción.

### 3.2 Guardar y Re-deploy

1. Click **"Save"**
2. Railway hará **auto-deploy** automáticamente
3. Espera 2-3 minutos

---

## 🌐 Paso 4: Obtener la URL de tu API

### 4.1 Generar dominio público

1. En el dashboard de Railway
2. Click en tu servicio
3. Click en la pestaña **"Settings"**
4. Scroll hasta **"Networking"**
5. Click **"Generate Domain"**
6. Railway te dará una URL como: `https://dealclick-backend-production.up.railway.app`

### 4.2 (Opcional) Dominio personalizado

1. En la misma sección de **"Networking"**
2. Click **"Custom Domain"**
3. Ingresa tu dominio: `api.dealclick.com`
4. Configura el CNAME en tu proveedor de DNS:
   ```
   CNAME: api.dealclick.com → dealclick-backend-production.up.railway.app
   ```

---

## 🧪 Paso 5: Testing

### 5.1 Verificar que el backend funciona

```bash
# Reemplaza con tu URL de Railway
curl https://dealclick-backend-production.up.railway.app/properties
```

**Respuesta esperada:**
```json
{"data":[],"total":0,"page":1,"totalPages":0}
```

### 5.2 Test de registro

```bash
curl -X POST https://TU_URL_DE_RAILWAY/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@dealclick.com",
    "password": "Test123!",
    "name": "Test User",
    "userHandle": "testuser"
  }'
```

### 5.3 Test de upload de imagen

```bash
# Primero registra un usuario y obtén el token
# Luego:
curl -X POST https://TU_URL_DE_RAILWAY/storage/upload \
  -H "Authorization: Bearer TU_TOKEN" \
  -F "file=@test-image.jpg"
```

---

## 📱 Paso 6: Actualizar Frontend

### 6.1 Actualizar la URL del API

Edita `services/api.ts`:

```typescript
// API Configuration
export const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3000'  // Development
  : 'https://dealclick-backend-production.up.railway.app'; // Railway URL
```

### 6.2 Rebuild la app

```bash
# Si es Expo
expo start --clear

# Si es build nativo
npm run ios  # o npm run android
```

---

## 🔍 Paso 7: Monitoreo

### 7.1 Ver logs en tiempo real

1. En Railway dashboard
2. Click en tu servicio
3. Click en la pestaña **"Logs"**
4. Verás los logs en tiempo real

### 7.2 Métricas

1. Pestaña **"Metrics"**
2. Verás:
   - CPU usage
   - Memory usage
   - Network I/O
   - Request count

---

## 💰 Costos

### Railway Pricing

**Hobby Plan (Gratis):**
- $5 crédito/mes gratis
- 500 horas de ejecución/mes
- 512MB RAM
- 1GB disco

**Developer Plan ($5/mes):**
- Sin límite de horas
- 8GB RAM
- 100GB disco

**Uso estimado para DealClick:**
- Backend básico: ~$1-2/mes
- Con tráfico moderado: ~$3-5/mes

---

## 🔧 Troubleshooting

### Error: "Application failed to start"

**Causa:** Variables de entorno incorrectas o faltantes

**Solución:**
1. Verifica todas las variables en Railway
2. Especialmente `DB_HOST`, `DB_PASSWORD`, `B2_APPLICATION_KEY`
3. Re-deploy después de corregir

### Error: "Cannot connect to database"

**Causa:** Credenciales de Supabase incorrectas

**Solución:**
1. Ve a Supabase dashboard
2. Settings → Database
3. Copia las credenciales de **Connection Pooling**
4. Actualiza en Railway

### Error: "Port already in use"

**Causa:** Railway intenta usar un puerto específico

**Solución:**
Railway asigna el puerto automáticamente via variable `PORT`. Nuestro código ya lo maneja en `main.ts`:
```typescript
const port = process.env.PORT || 3000;
```

### Error: Build falla

**Causa:** Dependencias faltantes o TypeScript errors

**Solución:**
1. Verifica que `package.json` tenga todas las dependencias
2. Corre `npm run build` localmente para verificar
3. Commit y push los fixes

---

## 🚀 Auto-Deploy

### Configurar auto-deploy desde GitHub

Railway ya está configurado para auto-deploy. Cada vez que hagas push a `main`:

```bash
git add .
git commit -m "Update feature X"
git push origin main
```

Railway automáticamente:
1. Detecta el push
2. Hace pull del código
3. Ejecuta `npm install`
4. Ejecuta `npm run build`
5. Reinicia con `npm run start:prod`
6. Tu API está actualizada en 2-3 minutos

---

## 📊 Monitoreo Avanzado (Opcional)

### Sentry para error tracking

```bash
npm install @sentry/node @sentry/tracing
```

En `main.ts`:
```typescript
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: 'YOUR_SENTRY_DSN',
  environment: process.env.NODE_ENV,
});
```

### Logging con Winston

```bash
npm install winston
```

---

## 🎉 ¡Deployment Completado!

Tu backend está ahora:
- ✅ Desplegado en Railway
- ✅ Con HTTPS automático
- ✅ Auto-deploy desde GitHub
- ✅ Variables de entorno configuradas
- ✅ Conectado a Supabase
- ✅ Conectado a Backblaze B2
- ✅ Listo para producción

### URLs importantes:

- **API:** https://TU_PROYECTO.up.railway.app
- **Dashboard:** https://railway.app/project/TU_PROYECTO
- **Logs:** https://railway.app/project/TU_PROYECTO/service/logs
- **Metrics:** https://railway.app/project/TU_PROYECTO/service/metrics

---

## 🆘 Soporte

**Railway Docs:** https://docs.railway.app/  
**Railway Discord:** https://discord.gg/railway  
**Status Page:** https://status.railway.app/

---

**¡Felicidades! Tu backend está en producción! 🎊**

