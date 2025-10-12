# Migration: Agregar campo `hidden` a Properties y Requirements

## 🎯 Objetivo
Agregar la funcionalidad de "ocultar" (soft delete) para que los usuarios puedan ocultar sus propiedades y requerimientos sin eliminarlos permanentemente de la base de datos.

## ⚠️ IMPORTANTE: Ejecutar este SQL en Supabase

### 📝 Pasos:

1. **Ve a Supabase Dashboard:**
   - Abre https://supabase.com
   - Selecciona tu proyecto de DealClick

2. **Abre el SQL Editor:**
   - Click en "SQL Editor" en el menú lateral
   - Click en "New Query"

3. **Copia y ejecuta este SQL:**

```sql
-- Add hidden column to properties table
ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS hidden BOOLEAN DEFAULT false;

-- Add hidden column to requirements table
ALTER TABLE requirements 
ADD COLUMN IF NOT EXISTS hidden BOOLEAN DEFAULT false;

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_properties_hidden ON properties(hidden);
CREATE INDEX IF NOT EXISTS idx_requirements_hidden ON requirements(hidden);
```

4. **Verificar que se ejecutó correctamente:**

```sql
-- Check if columns were added
SELECT 
  column_name, 
  data_type, 
  column_default
FROM information_schema.columns
WHERE table_name IN ('properties', 'requirements')
  AND column_name = 'hidden';
```

Deberías ver 2 filas:
- `properties.hidden` - BOOLEAN - false
- `requirements.hidden` - BOOLEAN - false

## ✅ Resultado

Después de ejecutar este SQL:
- ✅ Todas las propiedades y requerimientos tendrán `hidden = false` por defecto
- ✅ Los usuarios podrán ocultar sus elementos cambiando `hidden = true`
- ✅ Los elementos ocultos NO aparecerán en el feed público
- ✅ Los elementos ocultos SÍ aparecerán en el perfil del usuario (para que los pueda gestionar)

## 🔧 Funcionalidad en la app

### En el feed público:
- Solo se muestran elementos con `hidden = false`

### En el perfil del usuario:
- Se muestran todos sus elementos (ocultos y visibles)
- Puede ocultar elementos tocando el ícono del ojo
- Los elementos ocultos se marcan con `hidden = true` pero permanecen en la BD

## 🚀 Backend actualizado
El backend ya está preparado para manejar el campo `hidden`:
- ✅ Entidades actualizadas (Property y Requirement)
- ✅ DTOs actualizados (UpdatePropertyDto y UpdateRequirementDto)
- ✅ Servicios actualizados (filtran elementos ocultos en findAll)
- ✅ Deployment en Railway completado

Solo falta ejecutar el SQL en Supabase!

