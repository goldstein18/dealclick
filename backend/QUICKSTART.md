# 🚀 Quick Start - DealClick Backend

## ⚡ Inicio Rápido (5 minutos)

### 1. Instalar PostgreSQL con Docker

```bash
docker run --name dealclick-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=dealclick \
  -p 5432:5432 \
  -d postgres:15
```

### 2. Configurar Variables de Entorno

```bash
cd backend
cp env.example .env
```

Edita `.env` si necesitas cambiar algo (las defaults funcionan).

### 3. Instalar Dependencias (Ya hecho ✓)

```bash
npm install
```

### 4. Iniciar el Servidor

```bash
npm run start:dev
```

Deberías ver:
```
🚀 DealClick API running on http://localhost:3000
```

## 🧪 Probar la API

### 1. Registrar un Usuario

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@dealclick.com",
    "password": "test123",
    "name": "María González",
    "userHandle": "mariagonzalez",
    "whatsappNumber": "521234567890",
    "company": "RE/MAX"
  }'
```

Guardar el `access_token` de la respuesta.

### 2. Crear una Propiedad

```bash
curl -X POST http://localhost:3000/properties \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -d '{
    "title": "Casa moderna en Las Condes",
    "description": "Hermosa casa con acabados de lujo",
    "price": "$85,000,000",
    "location": "Las Condes, Santiago",
    "propertyType": "Casa",
    "images": ["https://example.com/image.jpg"],
    "beds": 4,
    "baths": 3,
    "area": 320,
    "parking": 2
  }'
```

### 3. Listar Propiedades

```bash
curl http://localhost:3000/properties
```

### 4. Crear un Requerimiento

```bash
curl -X POST http://localhost:3000/requirements \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -d '{
    "requirement": "Busco departamento de 2-3 dormitorios en Las Condes",
    "propertyType": "Departamento",
    "location": "Las Condes",
    "budget": "Hasta $90,000,000"
  }'
```

### 5. Buscar Asesores

```bash
curl http://localhost:3000/advisors
```

## 📱 Conectar con la App Móvil

En tu app React Native, actualiza el contexto para usar la API:

```typescript
// contexts/FeedContext.tsx
import { propertiesAPI, requirementsAPI } from '../services/api';

export function FeedProvider({ children }: { children: ReactNode }) {
  const [properties, setProperties] = useState<PropertyData[]>([]);
  const [requirements, setRequirements] = useState<RequirementData[]>([]);
  const [loading, setLoading] = useState(true);

  // Load data from API on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [propsRes, reqsRes] = await Promise.all([
        propertiesAPI.getAll({ page: 1, limit: 20 }),
        requirementsAPI.getAll({ page: 1, limit: 20 }),
      ]);
      
      setProperties(propsRes.data);
      setRequirements(reqsRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const addProperty = async (property: PropertyData) => {
    try {
      const created = await propertiesAPI.create(property);
      setProperties([created, ...properties]);
      return created;
    } catch (error) {
      Alert.alert('Error', 'No se pudo publicar la propiedad');
      throw error;
    }
  };

  const addRequirement = async (requirement: RequirementData) => {
    try {
      const created = await requirementsAPI.create({
        requirement: requirement.requirement,
        propertyType: requirement.propertyType,
        location: requirement.location,
        budget: requirement.budget,
      });
      setRequirements([created, ...requirements]);
      return created;
    } catch (error) {
      Alert.alert('Error', 'No se pudo publicar el requerimiento');
      throw error;
    }
  };

  return (
    <FeedContext.Provider value={{ properties, requirements, addProperty, addRequirement, loading }}>
      {children}
    </FeedContext.Provider>
  );
}
```

## 🔑 Endpoints Listos

✅ **Auth**
- POST /auth/register
- POST /auth/login
- POST /auth/biometric-login
- POST /auth/refresh
- POST /auth/me

✅ **Properties**
- GET /properties (con filtros)
- GET /properties/:id
- POST /properties
- PATCH /properties/:id
- DELETE /properties/:id
- POST /properties/:id/like
- POST /properties/:id/view

✅ **Requirements**
- GET /requirements (con filtros)
- GET /requirements/:id
- POST /requirements
- PATCH /requirements/:id
- DELETE /requirements/:id
- POST /requirements/:id/like

✅ **Advisors**
- GET /advisors (con filtros)
- GET /advisors/:id
- GET /advisors/:id/properties

✅ **Users**
- GET /users/:id
- GET /users/handle/:handle
- PATCH /users/:id

## 🎯 ¡Listo para Integrar!

El backend está completamente funcional y listo para ser usado por tu app móvil.

