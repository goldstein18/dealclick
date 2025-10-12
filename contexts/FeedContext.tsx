import React, { createContext, ReactNode, useContext, useState } from 'react';
import type { PropertyData, RequirementData } from '../components';

interface FeedContextType {
  properties: PropertyData[];
  requirements: RequirementData[];
  addProperty: (property: PropertyData) => void;
  addRequirement: (requirement: RequirementData) => void;
}

const FeedContext = createContext<FeedContextType | undefined>(undefined);

// Initial mock data
const initialProperties: PropertyData[] = [
  {
    id: "1",
    title: "Casa moderna en Las Condes",
    price: "$85,000,000",
    location: "Las Condes, Santiago",
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400",
    beds: 3,
    baths: 2,
    area: 120
  },
  {
    id: "2",
    title: "Departamento premium en Providencia",
    price: "$65,000,000",
    location: "Providencia, Santiago",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400",
    beds: 2,
    baths: 2,
    area: 85
  }
];

const initialRequirements: RequirementData[] = [
  {
    id: "1",
    userName: "María González",
    userHandle: "mariagonzalez",
    avatar: "https://i.pravatar.cc/100?img=1",
    requirement: "Busco departamento de 2-3 dormitorios en Las Condes, presupuesto hasta $90M. ¿Alguien tiene algo disponible?",
    timeAgo: "2h",
    whatsappNumber: "521234567890"
  },
  {
    id: "2",
    userName: "Carlos Mendoza",
    userHandle: "carlosmendoza",
    avatar: "https://i.pravatar.cc/100?img=2",
    requirement: "Cliente busca oficina comercial en Providencia, mínimo 100m². Zona céntrica y buena conectividad. Contactar DM.",
    timeAgo: "4h",
    whatsappNumber: "521234567891"
  }
];

export function FeedProvider({ children }: { children: ReactNode }) {
  const [properties, setProperties] = useState<PropertyData[]>(initialProperties);
  const [requirements, setRequirements] = useState<RequirementData[]>(initialRequirements);

  const addProperty = (property: PropertyData) => {
    setProperties([property, ...properties]);
  };

  const addRequirement = (requirement: RequirementData) => {
    setRequirements([requirement, ...requirements]);
  };

  return (
    <FeedContext.Provider
      value={{
        properties,
        requirements,
        addProperty,
        addRequirement,
      }}
    >
      {children}
    </FeedContext.Provider>
  );
}

export function useFeed() {
  const context = useContext(FeedContext);
  if (context === undefined) {
    throw new Error('useFeed must be used within a FeedProvider');
  }
  return context;
}

