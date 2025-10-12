# Componentes Reutilizables - DealClick

Este directorio contiene todos los componentes reutilizables de la aplicación, diseñados para ser fácilmente conectados al backend y crear múltiples instancias dinámicamente.

## 📦 Componentes Disponibles

### 1. PropertyCard
Tarjeta de propiedad inmobiliaria.

**Props:**
```typescript
interface PropertyCardProps {
  property: PropertyData;
  onPress?: () => void;
}

interface PropertyData {
  id: string;
  image: string;
  title: string;
  location: string;
  price: string;
  beds?: number;
  baths?: number;
  area?: number;
}
```

**Uso:**
```tsx
import { PropertyCard } from '@/components';

<PropertyCard 
  property={{
    id: "1",
    title: "Casa moderna en Las Condes",
    price: "$85,000,000",
    location: "Las Condes, Santiago",
    image: "https://example.com/image.jpg",
    beds: 3,
    baths: 2,
    area: 120
  }}
  onPress={() => console.log('Property clicked')}
/>
```

**Integración con Backend:**
```tsx
const properties = await fetch('/api/properties').then(r => r.json());

{properties.map((property: PropertyData) => (
  <PropertyCard 
    key={property.id}
    property={property}
    onPress={() => router.push(`/property/${property.id}`)}
  />
))}
```

---

### 2. RequirementCard
Tarjeta de requerimiento de usuario.

**Props:**
```typescript
interface RequirementCardProps {
  requirement: RequirementData;
  onUserPress?: () => void;
  onWhatsAppPress?: () => void;
}

interface RequirementData {
  id: string;
  userName: string;
  userHandle: string;
  avatar: string;
  timeAgo: string;
  requirement: string;
  whatsappNumber?: string;
}
```

**Uso:**
```tsx
import { RequirementCard } from '@/components';

<RequirementCard 
  requirement={{
    id: "1",
    userName: "María González",
    userHandle: "mariagonzalez",
    avatar: "https://example.com/avatar.jpg",
    requirement: "Busco departamento de 2-3 dormitorios...",
    timeAgo: "2h",
    whatsappNumber: "521234567890"
  }}
  onUserPress={() => router.push(`/user/${requirement.id}`)}
/>
```

**Integración con Backend:**
```tsx
const requirements = await fetch('/api/requirements').then(r => r.json());

{requirements.map((requirement: RequirementData) => (
  <RequirementCard 
    key={requirement.id}
    requirement={requirement}
    onUserPress={() => router.push(`/user/${requirement.userHandle}`)}
    onWhatsAppPress={() => handleCustomWhatsApp(requirement)}
  />
))}
```

---

### 3. AdvisorCard
Tarjeta de asesor inmobiliario.

**Props:**
```typescript
interface AdvisorCardProps {
  advisor: AdvisorData;
  onPress?: () => void;
}

interface AdvisorData {
  id: string;
  nombre: string;
  empresa: string;
  especialidad: string;
  ubicacion: string;
  imagen: string;
  propiedades?: number;
  calificacion?: number;
}
```

**Uso:**
```tsx
import { AdvisorCard } from '@/components';

<AdvisorCard 
  advisor={{
    id: "1",
    nombre: "Ana López",
    empresa: "RE/MAX",
    especialidad: "Residencial",
    ubicacion: "CDMX",
    imagen: "https://example.com/advisor.jpg",
    propiedades: 12,
    calificacion: 4.8
  }}
  onPress={() => router.push(`/advisor/${advisor.id}`)}
/>
```

**Integración con Backend:**
```tsx
const advisors = await fetch('/api/advisors').then(r => r.json());

<FlatList
  data={advisors}
  renderItem={({ item }) => (
    <AdvisorCard 
      advisor={item}
      onPress={() => router.push(`/advisor/${item.id}`)}
    />
  )}
  keyExtractor={item => item.id}
/>
```

---

### 4. UserProfile
Componente completo de perfil de usuario.

**Props:**
```typescript
interface UserProfileProps {
  user: UserProfileData;
  isEditable?: boolean;
  onEditPress?: () => void;
  onSettingsPress?: () => void;
}

interface UserProfileData {
  id: string;
  name: string;
  role: string;
  license?: string;
  bio?: string;
  email?: string;
  phone?: string;
  company?: string;
  experience?: string;
  specialties?: string[];
  image?: string;
}
```

**Uso:**
```tsx
import { UserProfile } from '@/components';

<UserProfile 
  user={{
    id: "1",
    name: "María González",
    role: "Agente Inmobiliario",
    license: "ABC123",
    bio: "Especialista en propiedades residenciales...",
    email: "maria@example.com",
    phone: "+52 123 456 7890",
    company: "RE/MAX",
    experience: "5 años",
    specialties: ["Residencial", "Comercial"],
    image: "https://example.com/profile.jpg"
  }}
  isEditable={true}
  onEditPress={() => router.push('/edit-profile')}
  onSettingsPress={() => router.push('/settings')}
/>
```

**Integración con Backend:**
```tsx
const user = await fetch(`/api/users/${userId}`).then(r => r.json());

<UserProfile 
  user={user}
  isEditable={currentUserId === userId}
  onEditPress={() => router.push('/edit-profile')}
  onSettingsPress={() => router.push('/settings')}
/>
```

---

## 🔗 Importación

Todos los componentes se pueden importar desde el barrel file:

```tsx
import { 
  PropertyCard, 
  RequirementCard, 
  AdvisorCard, 
  UserProfile 
} from '@/components';

// O importar tipos
import type { 
  PropertyData, 
  RequirementData, 
  AdvisorData, 
  UserProfileData 
} from '@/components';
```

---

## 🎨 Personalización

Todos los componentes usan:
- **Font:** System (SF Pro en iOS)
- **Color Principal:** `#000` (Negro)
- **Estilo:** Moderno, minimalista, con sombras sutiles

Los estilos están encapsulados dentro de cada componente y pueden ser modificados editando el archivo del componente directamente.

---

## 🚀 Ejemplos de Integración con Backend

### Ejemplo 1: Fetching y Renderizado Simple
```tsx
import { PropertyCard, PropertyData } from '@/components';
import { useEffect, useState } from 'react';

function PropertiesScreen() {
  const [properties, setProperties] = useState<PropertyData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/properties')
      .then(res => res.json())
      .then(data => {
        setProperties(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <ActivityIndicator />;

  return (
    <ScrollView>
      {properties.map(property => (
        <PropertyCard 
          key={property.id}
          property={property}
          onPress={() => router.push(`/property/${property.id}`)}
        />
      ))}
    </ScrollView>
  );
}
```

### Ejemplo 2: Con React Query
```tsx
import { useQuery } from '@tanstack/react-query';
import { PropertyCard, PropertyData } from '@/components';

function PropertiesScreen() {
  const { data: properties, isLoading } = useQuery<PropertyData[]>({
    queryKey: ['properties'],
    queryFn: () => fetch('/api/properties').then(r => r.json())
  });

  if (isLoading) return <ActivityIndicator />;

  return (
    <FlatList
      data={properties}
      renderItem={({ item }) => (
        <PropertyCard 
          property={item}
          onPress={() => router.push(`/property/${item.id}`)}
        />
      )}
      keyExtractor={item => item.id}
    />
  );
}
```

### Ejemplo 3: Con Paginación
```tsx
import { PropertyCard, PropertyData } from '@/components';
import { useState, useEffect } from 'react';

function PropertiesScreen() {
  const [properties, setProperties] = useState<PropertyData[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadMore = async () => {
    const response = await fetch(`/api/properties?page=${page}`);
    const data = await response.json();
    
    setProperties(prev => [...prev, ...data.properties]);
    setHasMore(data.hasMore);
    setPage(prev => prev + 1);
  };

  return (
    <FlatList
      data={properties}
      renderItem={({ item }) => (
        <PropertyCard 
          property={item}
          onPress={() => router.push(`/property/${item.id}`)}
        />
      )}
      keyExtractor={item => item.id}
      onEndReached={hasMore ? loadMore : undefined}
      onEndReachedThreshold={0.5}
    />
  );
}
```

---

## 📝 Tipos de Datos

Todos los tipos están definidos en `/types/index.ts` y también exportados desde cada componente.

```typescript
// types/index.ts
export interface PropertyData { ... }
export interface RequirementData { ... }
export interface AdvisorData { ... }
export interface UserProfileData { ... }
export interface FilterOptions { ... }
```

---

## ✅ Checklist de Integración con Backend

- [ ] Definir endpoints de API
- [ ] Mapear respuestas del backend a los tipos TypeScript
- [ ] Implementar loading states
- [ ] Implementar error handling
- [ ] Agregar pull-to-refresh
- [ ] Implementar paginación si es necesario
- [ ] Agregar caché (React Query, SWR, etc.)
- [ ] Implementar filtros dinámicos
- [ ] Agregar búsqueda en tiempo real
- [ ] Implementar actualización optimista

---

## 🔧 Mejores Prácticas

1. **Siempre usar TypeScript:** Los componentes están fuertemente tipados
2. **Memoización:** Usa `React.memo()` para componentes de lista
3. **Virtualización:** Usa `FlatList` para listas largas
4. **Keys únicas:** Siempre usa IDs únicos como keys
5. **Error boundaries:** Implementa error boundaries para componentes de lista
6. **Loading states:** Siempre muestra feedback al usuario
7. **Placeholders:** Usa skeleton screens o shimmer effects
8. **Accesibilidad:** Los componentes incluyen iconos de Ionicons que son accesibles

---

## 📚 Recursos Adicionales

- [React Native Documentation](https://reactnative.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Expo Router Documentation](https://docs.expo.dev/router/introduction/)
- [React Query Documentation](https://tanstack.com/query/latest)

---

¡Los componentes están listos para ser conectados a tu backend! 🎉

