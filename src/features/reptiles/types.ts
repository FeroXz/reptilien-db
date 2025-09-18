
export interface Reptile {
  id: string;
  species: string;
  name?: string;
  age?: string;
  gender: 'männlich' | 'weiblich' | 'unbekannt';
  price?: number;
  genetics?: string;
  origin?: string;
  code?: string;
  weight?: number;
  length?: number;
  description?: string;
  images?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ReptileFormData {
  species: string;
  name?: string;
  age?: string;
  gender: 'männlich' | 'weiblich' | 'unbekannt';
  price?: number;
  genetics?: string;
  origin?: string;
  code?: string;
  weight?: number;
  length?: number;
  description?: string;
}
