import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import type { PropertyData, RequirementData } from '../components';
import { propertiesAPI, requirementsAPI } from '../services/api';

interface FeedContextType {
  properties: PropertyData[];
  requirements: RequirementData[];
  loading: boolean;
  error: string | null;
  refreshFeed: () => Promise<void>;
  addProperty: (property: PropertyData) => void;
  addRequirement: (requirement: RequirementData) => void;
  // Callbacks for profile updates
  onPropertyAdded?: () => void;
  onRequirementAdded?: () => void;
  setOnPropertyAdded?: (callback: () => void) => void;
  setOnRequirementAdded?: (callback: () => void) => void;
}

const FeedContext = createContext<FeedContextType | undefined>(undefined);

// Helper function to transform API data to component format
const transformPropertyData = (apiProperty: any): PropertyData => ({
  id: apiProperty.id,
  title: apiProperty.title || `${apiProperty.type} en ${apiProperty.location}`,
  price: `$${apiProperty.price?.toLocaleString() || 'Consultar'}`,
  location: apiProperty.location || 'Ubicación no especificada',
  image: apiProperty.images?.[0] || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400",
  beds: apiProperty.bedrooms || 0,
  baths: apiProperty.bathrooms || 0,
  area: apiProperty.area || 0
});

const transformRequirementData = (apiRequirement: any): RequirementData => ({
  id: apiRequirement.id,
  userName: apiRequirement.user?.name || 'Usuario',
  userHandle: apiRequirement.user?.userHandle || 'usuario',
  avatar: apiRequirement.user?.avatar || require('../assets/images/frontlogo.png'),
  requirement: apiRequirement.requirement || apiRequirement.description || 'Sin descripción',
  timeAgo: formatTimeAgo(apiRequirement.createdAt),
  whatsappNumber: apiRequirement.user?.whatsappNumber || ""
});

// Helper function to format time ago
function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'Ahora';
  if (diffInMinutes < 60) return `${diffInMinutes}m`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
  return `${Math.floor(diffInMinutes / 1440)}d`;
}

export function FeedProvider({ children }: { children: ReactNode }) {
  const [properties, setProperties] = useState<PropertyData[]>([]);
  const [requirements, setRequirements] = useState<RequirementData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [onPropertyAdded, setOnPropertyAdded] = useState<(() => void) | undefined>(undefined);
  const [onRequirementAdded, setOnRequirementAdded] = useState<(() => void) | undefined>(undefined);

  const loadFeedData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Loading feed data from API...');
      
      // Load properties and requirements in parallel
      const [propertiesResponse, requirementsResponse] = await Promise.all([
        propertiesAPI.getAll(),
        requirementsAPI.getAll()
      ]);
      
      console.log('Properties response:', propertiesResponse);
      console.log('Requirements response:', requirementsResponse);
      
      // Transform and set the data
      const transformedProperties = propertiesResponse.data?.map(transformPropertyData) || [];
      const transformedRequirements = requirementsResponse.data?.map(transformRequirementData) || [];
      
      setProperties(transformedProperties);
      setRequirements(transformedRequirements);
      
      console.log('Feed data loaded successfully');
    } catch (err: any) {
      console.error('Error loading feed data:', err);
      setError(err.response?.data?.message || 'Error al cargar los datos');
      // Set empty arrays on error
      setProperties([]);
      setRequirements([]);
    } finally {
      setLoading(false);
    }
  };

  const refreshFeed = async () => {
    await loadFeedData();
  };

  // Load data on mount
  useEffect(() => {
    loadFeedData();
  }, []);

  const addProperty = (property: PropertyData) => {
    setProperties([property, ...properties]);
    // Notify profile to refresh
    if (onPropertyAdded) {
      onPropertyAdded();
    }
  };

  const addRequirement = (requirement: RequirementData) => {
    setRequirements([requirement, ...requirements]);
    // Notify profile to refresh
    if (onRequirementAdded) {
      onRequirementAdded();
    }
  };

  return (
    <FeedContext.Provider
      value={{
        properties,
        requirements,
        loading,
        error,
        refreshFeed,
        addProperty,
        addRequirement,
        onPropertyAdded,
        onRequirementAdded,
        setOnPropertyAdded,
        setOnRequirementAdded,
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

