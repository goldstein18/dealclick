# 🚀 Storage Quick Start - DealClick

## 📦 ¿Qué se instaló?

### **Backend (NestJS)**
- ✅ Módulo de Storage (`src/storage/`)
- ✅ Servicio de Backblaze B2 con auto-resize
- ✅ Endpoints de upload (single y múltiple)
- ✅ Integración con Cloudflare CDN
- ✅ Optimización automática a WebP

### **Frontend (React Native)**
- ✅ Servicio de upload (`services/storage.service.ts`)
- ✅ Componente `publish-property` actualizado
- ✅ Progress bar de upload
- ✅ Validaciones de tamaño y formato

---

## ⚡ Quick Setup (5 minutos)

### **1. Configura Backblaze B2**

```bash
# 1. Crea cuenta en https://www.backblaze.com/b2/sign-up.html
# 2. Crea bucket "dealclick-images"
# 3. Crea Application Key con Read/Write access
# 4. Copia las credenciales
```

### **2. Configura Cloudflare (Opcional pero recomendado)**

```bash
# 1. Crea cuenta en https://dash.cloudflare.com/sign-up
# 2. Agrega tu dominio
# 3. Crea CNAME: cdn -> f000.backblazeb2.com
# 4. Activa "Proxied" (naranja)
```

### **3. Actualiza `.env`**

```env
B2_APPLICATION_KEY_ID=tu_key_id
B2_APPLICATION_KEY=tu_application_key
B2_BUCKET_ID=tu_bucket_id
B2_BUCKET_NAME=dealclick-images
B2_CDN_URL=https://cdn.tudominio.com
```

### **4. Inicia el backend**

```bash
cd backend
npm run start:dev
```

### **5. Test con cURL**

```bash
# Registra usuario
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test123!","name":"Test"}'

# Upload imagen (reemplaza YOUR_TOKEN)
curl -X POST http://localhost:3000/storage/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@image.jpg"
```

---

## 🎯 Endpoints Disponibles

### **POST /storage/upload**
Upload de imagen individual

**Headers:**
```
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Body:**
```
file: imagen (max 10MB)
```

**Response:**
```json
{
  "original": "https://cdn.tudominio.com/original/abc.webp",
  "thumbnail": "https://cdn.tudominio.com/thumbnail/abc.webp",
  "medium": "https://cdn.tudominio.com/medium/abc.webp",
  "large": "https://cdn.tudominio.com/large/abc.webp"
}
```

### **POST /storage/upload-multiple**
Upload de múltiples imágenes (max 10)

**Headers:**
```
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Body:**
```
files: imágenes[]
```

**Response:**
```json
[
  {
    "original": "...",
    "thumbnail": "...",
    "medium": "...",
    "large": "..."
  },
  ...
]
```

---

## 📏 Tamaños de Imágenes

| Tipo | Ancho | Uso |
|------|-------|-----|
| **thumbnail** | 200px | Cards pequeños, previews |
| **medium** | 800px | Feed, listados |
| **large** | 1920px | Detalle de propiedad |
| **original** | Sin cambios | Backup, zoom |

**Formato:** Todas se convierten a **WebP** (mejor compresión, 30% más pequeño que JPEG)

---

## 💰 Costos Estimados

### **Para 1,000 propiedades (5 fotos cada una)**

| Concepto | Cálculo | Costo |
|----------|---------|-------|
| Storage | 23GB × $0.006/GB | $0.14/mes |
| Bandwidth | Con Cloudflare | **$0** |
| API Calls | Incluidas | $0 |
| **TOTAL** | | **$0.14/mes** |

### **Para 10,000 propiedades (5 fotos cada una)**

| Concepto | Cálculo | Costo |
|----------|---------|-------|
| Storage | 230GB × $0.006/GB | $1.38/mes |
| Bandwidth | Con Cloudflare | **$0** |
| **TOTAL** | | **$1.38/mes** |

**Comparación con AWS S3:**
- 10,000 propiedades en S3 = **$65/mes**
- 10,000 propiedades en B2+Cloudflare = **$1.38/mes**
- **Ahorro: 97%** 💰

---

## 🔧 Uso en React Native

### **Import**
```typescript
import { uploadImages } from '../services/storage.service';
```

### **Upload con progress**
```typescript
const handleUpload = async () => {
  const token = await AsyncStorage.getItem('authToken');
  
  const results = await uploadImages(
    imageUris,
    token,
    (progress) => {
      console.log(`Uploading: ${progress}%`);
    }
  );
  
  // results = [{ original, thumbnail, medium, large }, ...]
};
```

### **Mostrar imagen**
```tsx
<Image 
  source={{ uri: uploadResult.medium }} 
  style={{ width: 300, height: 200 }}
/>
```

---

## 🐛 Troubleshooting

### **Error: "Unauthorized"**
- Verifica `B2_APPLICATION_KEY_ID` y `B2_APPLICATION_KEY` en `.env`
- Asegúrate de que el Application Key tenga permisos "Read and Write"

### **Error: "Bucket not found"**
- Verifica `B2_BUCKET_ID` en `.env`
- Ve a Backblaze → Buckets y copia el ID exacto

### **Imágenes no cargan**
- Verifica que el bucket sea **Public**
- Si usas Cloudflare, verifica el CNAME
- Prueba con la URL nativa de B2 primero

### **Upload muy lento**
- Verifica tu conexión a internet
- El backend hace resize, puede tomar 2-5 segundos por imagen
- Si subes 10 imágenes, puede tomar 20-50 segundos

---

## 📚 Documentación Completa

Para setup detallado, ver: `backend/BACKBLAZE_B2_SETUP.md`

---

## 🎉 ¡Listo!

Ahora tienes:
- ✅ Storage super barato ($0.14/mes para 1K propiedades)
- ✅ CDN global gratis
- ✅ Auto-optimización (WebP, resize)
- ✅ $0 bandwidth con Cloudflare
- ✅ Endpoints listos para usar

**Next steps:**
1. Configura Backblaze B2
2. (Opcional) Configura Cloudflare CDN
3. Actualiza `.env`
4. ¡Comienza a subir imágenes! 🚀

