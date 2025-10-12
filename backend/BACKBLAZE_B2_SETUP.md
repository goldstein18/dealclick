# 🚀 Backblaze B2 + Cloudflare CDN Setup Guide

Guía completa para configurar almacenamiento de imágenes con **Backblaze B2** y **Cloudflare CDN** para DealClick.

---

## 📋 Tabla de Contenidos

1. [¿Por qué Backblaze B2 + Cloudflare?](#por-qué-backblaze-b2--cloudflare)
2. [Crear cuenta en Backblaze B2](#paso-1-crear-cuenta-en-backblaze-b2)
3. [Crear Bucket](#paso-2-crear-bucket)
4. [Obtener credenciales](#paso-3-obtener-credenciales)
5. [Configurar Cloudflare CDN](#paso-4-configurar-cloudflare-cdn)
6. [Configurar Backend](#paso-5-configurar-backend)
7. [Testing](#paso-6-testing)
8. [Troubleshooting](#troubleshooting)

---

## 💡 ¿Por qué Backblaze B2 + Cloudflare?

### **Comparación de Costos (100GB storage + 500GB bandwidth/mes)**

| Provider | Costo Mensual |
|----------|---------------|
| **Backblaze B2 + Cloudflare** | **$6** ✅ |
| AWS S3 + CloudFront | $65 |
| Supabase Storage | $10 |

### **Ventajas:**
- ✅ **75% más barato** que AWS S3
- ✅ **$0 bandwidth costs** con Cloudflare (Bandwidth Alliance)
- ✅ **CDN global** gratis (200+ edge locations)
- ✅ **Auto-optimización** de imágenes (WebP, resize)
- ✅ **SSL incluido**
- ✅ **S3-compatible API** (fácil migración)

---

## 📝 Paso 1: Crear cuenta en Backblaze B2

1. Ve a [https://www.backblaze.com/b2/sign-up.html](https://www.backblaze.com/b2/sign-up.html)
2. Regístrate con tu email
3. Verifica tu cuenta
4. **Free tier:** 10GB storage + 1GB download/día gratis

---

## 🪣 Paso 2: Crear Bucket

1. Inicia sesión en [https://secure.backblaze.com/](https://secure.backblaze.com/)
2. Ve a **"Buckets"** en el menú lateral
3. Click en **"Create a Bucket"**
4. Configuración:
   - **Bucket Name:** `dealclick-images` (debe ser único globalmente)
   - **Files in Bucket:** `Public`
   - **Default Encryption:** `Disable` (opcional)
   - **Object Lock:** `Disable`
5. Click **"Create a Bucket"**
6. **Guarda el Bucket ID** (lo necesitarás después)

---

## 🔑 Paso 3: Obtener Credenciales

### **3.1 Crear Application Key**

1. Ve a **"App Keys"** en el menú lateral
2. Click en **"Add a New Application Key"**
3. Configuración:
   - **Name:** `dealclick-api`
   - **Allow access to Bucket(s):** Selecciona `dealclick-images`
   - **Type of Access:** `Read and Write`
   - **Allow List All Bucket Names:** ✅
   - **File name prefix:** Dejar vacío
   - **Duration:** Sin límite
4. Click **"Create New Key"**
5. **⚠️ IMPORTANTE:** Guarda inmediatamente:
   - `keyID` (Application Key ID)
   - `applicationKey` (solo se muestra una vez)

### **3.2 Obtener Bucket ID**

1. Ve a **"Buckets"**
2. Click en `dealclick-images`
3. Copia el **Bucket ID** (formato: `abc123...`)

### **3.3 Obtener Bucket Name**

- Ya lo tienes: `dealclick-images`

---

## 🌐 Paso 4: Configurar Cloudflare CDN

### **Opción A: Con Dominio Propio (Recomendado)**

#### **4.1 Agregar sitio a Cloudflare**

1. Crea cuenta en [https://dash.cloudflare.com/sign-up](https://dash.cloudflare.com/sign-up)
2. Click **"Add a Site"**
3. Ingresa tu dominio (ej: `dealclick.com`)
4. Selecciona plan **Free**
5. Cambia los nameservers de tu dominio a los de Cloudflare

#### **4.2 Configurar CNAME para B2**

1. Ve a **DNS** en tu dominio de Cloudflare
2. Click **"Add record"**
3. Configuración:
   - **Type:** `CNAME`
   - **Name:** `cdn` (resultará en `cdn.dealclick.com`)
   - **Target:** `f000.backblazeb2.com`
   - **Proxy status:** ✅ **Proxied** (naranja)
   - **TTL:** Auto
4. Click **"Save"**

#### **4.3 Configurar Page Rules**

1. Ve a **Rules** → **Page Rules**
2. Click **"Create Page Rule"**
3. Configuración:
   - **URL:** `cdn.dealclick.com/file/dealclick-images/*`
   - **Settings:**
     - **Cache Level:** Cache Everything
     - **Edge Cache TTL:** 1 month
     - **Browser Cache TTL:** 1 day
4. Click **"Save and Deploy"**

#### **4.4 Habilitar Bandwidth Alliance**

1. Ve a **"Bandwidth Alliance"** en tu panel de Backblaze
2. Click **"Enable"** para Cloudflare
3. Esto elimina los costos de egress ($0 bandwidth) 🎉

#### **4.5 Tu CDN URL final:**

```
https://cdn.dealclick.com
```

---

### **Opción B: Sin Dominio (Native B2 URL)**

Si no tienes dominio, puedes usar la URL nativa de B2:

```
https://f000.backblaze.com/file/dealclick-images
```

**⚠️ No recomendado para producción:**
- Sin CDN = más lento
- Sin caché = más caro ($10/TB bandwidth)
- Sin SSL personalizado

---

## ⚙️ Paso 5: Configurar Backend

### **5.1 Configurar variables de entorno**

Edita `backend/.env`:

```env
# Backblaze B2 Storage
B2_APPLICATION_KEY_ID=abc123...
B2_APPLICATION_KEY=K001...
B2_BUCKET_ID=abc123...
B2_BUCKET_NAME=dealclick-images
B2_CDN_URL=https://cdn.dealclick.com

# O si no tienes dominio:
# B2_CDN_URL=https://f000.backblaze.com/file/dealclick-images
```

### **5.2 Instalar dependencias**

Ya están instaladas en el paso anterior:

```bash
cd backend
npm install backblaze-b2 sharp @types/sharp
```

### **5.3 Verificar módulo**

El módulo de Storage ya está configurado en:
- `backend/src/storage/storage.service.ts`
- `backend/src/storage/storage.controller.ts`
- `backend/src/storage/storage.module.ts`

---

## 🧪 Paso 6: Testing

### **6.1 Iniciar backend**

```bash
cd backend
npm run start:dev
```

### **6.2 Registrar usuario**

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@dealclick.com",
    "password": "Test123!",
    "name": "Test User"
  }'
```

Guarda el `access_token` de la respuesta.

### **6.3 Upload imagen de prueba**

```bash
# Reemplaza YOUR_TOKEN con el access_token del paso anterior
curl -X POST http://localhost:3000/storage/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@/path/to/test-image.jpg"
```

**Respuesta esperada:**

```json
{
  "original": "https://cdn.dealclick.com/original/abc123.webp",
  "thumbnail": "https://cdn.dealclick.com/thumbnail/abc123.webp",
  "medium": "https://cdn.dealclick.com/medium/abc123.webp",
  "large": "https://cdn.dealclick.com/large/abc123.webp"
}
```

### **6.4 Verificar imágenes**

Abre las URLs en tu navegador:
- ✅ Deberían cargar desde Cloudflare CDN
- ✅ Formato WebP (mejor compresión)
- ✅ Diferentes tamaños según la URL

---

## 🐛 Troubleshooting

### **Error: "Unauthorized"**

**Causa:** Credenciales incorrectas

**Solución:**
1. Verifica `B2_APPLICATION_KEY_ID` y `B2_APPLICATION_KEY` en `.env`
2. Asegúrate de que el Application Key tenga permisos de "Read and Write"
3. Verifica que el bucket ID sea correcto

### **Error: "Bucket not found"**

**Causa:** Bucket ID incorrecto

**Solución:**
1. Ve a Backblaze → Buckets
2. Copia el Bucket ID exacto
3. Actualiza `B2_BUCKET_ID` en `.env`

### **Imágenes no cargan desde Cloudflare**

**Causa:** CNAME no configurado o propagación DNS

**Solución:**
1. Verifica el CNAME en Cloudflare DNS
2. Asegúrate de que esté **Proxied** (naranja)
3. Espera 5-10 minutos para propagación DNS
4. Prueba con `dig cdn.dealclick.com` o `nslookup cdn.dealclick.com`

### **Imágenes muy lentas**

**Causa:** Usando URL nativa de B2 sin CDN

**Solución:**
1. Configura Cloudflare CDN (Paso 4)
2. Actualiza `B2_CDN_URL` en `.env`
3. Reinicia el backend

### **Error: "File too large"**

**Causa:** Imagen mayor a 10MB

**Solución:**
1. El límite está en `storage.controller.ts` línea 29
2. Aumenta el límite si es necesario (no recomendado)
3. O comprime la imagen antes de subir

---

## 📊 Monitoreo de Costos

### **Ver uso en Backblaze**

1. Ve a [https://secure.backblaze.com/billing.htm](https://secure.backblaze.com/billing.htm)
2. Revisa:
   - **Storage:** $0.006/GB/mes
   - **Download:** $0.01/GB (si no usas Cloudflare)
   - **Class C Transactions:** $0.004/10,000 (API calls)

### **Calcular costos para DealClick**

**Ejemplo: 1,000 propiedades con 5 fotos cada una**

- **Total imágenes:** 5,000
- **Tamaño promedio:** 3MB original + 150KB thumbnail + 500KB medium + 1MB large = 4.65MB por set
- **Storage total:** 5,000 × 4.65MB = ~23GB
- **Costo storage:** 23GB × $0.006 = **$0.14/mes**
- **Bandwidth:** Con Cloudflare = **$0** 🎉
- **Total:** **$0.14/mes** para 1,000 propiedades

---

## 🎉 ¡Listo!

Tu sistema de almacenamiento de imágenes está configurado con:
- ✅ Backblaze B2 para storage barato
- ✅ Cloudflare CDN para velocidad global
- ✅ Auto-resize y optimización (WebP)
- ✅ $0 bandwidth costs
- ✅ SSL incluido

---

## 📚 Recursos Adicionales

- [Backblaze B2 Docs](https://www.backblaze.com/b2/docs/)
- [Cloudflare Bandwidth Alliance](https://www.cloudflare.com/bandwidth-alliance/)
- [Sharp Image Processing](https://sharp.pixelplumbing.com/)
- [WebP Image Format](https://developers.google.com/speed/webp)

---

## 🆘 Soporte

¿Problemas? Revisa:
1. Los logs del backend: `backend/backend.log`
2. La consola de Backblaze: Errores en "Bucket Details"
3. La consola de Cloudflare: Analytics → Cache

---

**¡Felicidades! 🎊 Ahora tienes un sistema de imágenes world-class para DealClick!**

