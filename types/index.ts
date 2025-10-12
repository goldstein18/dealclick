// Property Types
export interface PropertyData {
  id: string;
  image: string;
  title: string;
  location: string;
  price: string;
  beds?: number;
  baths?: number;
  area?: number;
}

// Requirement Types
export interface RequirementData {
  id: string;
  userName: string;
  userHandle: string;
  avatar: string;
  timeAgo: string;
  requirement: string;
  whatsappNumber?: string;
}

// Advisor Types
export interface AdvisorData {
  id: string;
  nombre: string;
  empresa: string;
  especialidad: string;
  ubicacion: string;
  imagen: string;
  propiedades?: number;
  calificacion?: number;
}

// User Profile Types
export interface UserProfileData {
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

// Filter Types
export interface FilterOptions {
  tipo?: string;
  precio?: string;
  ubicacion?: string;
  estado?: string;
  especialidad?: string;
  empresa?: string;
}

