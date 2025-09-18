
export interface SpeciesCategory {
  id: string;
  name: string;
  parentId?: string;
  genetics: string[];
  isLeaf: boolean; // kann Reptilien enthalten
  description?: string;
  commonNames?: string[];
  scientificName?: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminConfig {
  passwordHash: string;
  lastLogin?: string;
  sessionTimeout: number; // in Minuten
}

export interface AdminSession {
  isAuthenticated: boolean;
  loginTime: number;
  expiresAt: number;
}

export interface CategoryFormData {
  name: string;
  parentId?: string;
  genetics: string[];
  description?: string;
  commonNames?: string[];
  scientificName?: string;
  isLeaf: boolean;
  isActive: boolean;
}

export interface GeneticsFormData {
  categoryId: string;
  genetics: string[];
}
