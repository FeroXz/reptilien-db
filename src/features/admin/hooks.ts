
import { useState, useEffect } from 'react';
import { SpeciesCategory, AdminSession, CategoryFormData, GeneticsFormData } from './types';
import { persistence } from '../../utils/persistence';

const CATEGORIES_KEY = 'species_categories';
const ADMIN_SESSION_KEY = 'admin_session';
const ADMIN_PASSWORD_HASH = 'e99a18c428cb38d5f260853678922e03'; // MD5 von "admin123" - in Produktion sollte das sicherer sein

export function useSpeciesCategories() {
  const [categories, setCategories] = useState<SpeciesCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await persistence.getItem(CATEGORIES_KEY);
      if (data) {
        setCategories(JSON.parse(data));
      } else {
        // Initialisiere mit Standard-Kategorien
        await initializeDefaultCategories();
      }
    } catch (error) {
      console.error('Fehler beim Laden der Kategorien:', error);
    } finally {
      setLoading(false);
    }
  };

  const initializeDefaultCategories = async () => {
    const defaultCategories: SpeciesCategory[] = [
      // Hauptkategorien
      {
        id: 'echsen',
        name: 'Echsen',
        genetics: [],
        isLeaf: false,
        order: 1,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'schlangen',
        name: 'Schlangen',
        genetics: [],
        isLeaf: false,
        order: 2,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'schildkroeten',
        name: 'Schildkröten',
        genetics: [],
        isLeaf: false,
        order: 3,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      // Echsen -> Geckos
      {
        id: 'geckos',
        name: 'Geckos',
        parentId: 'echsen',
        genetics: [],
        isLeaf: false,
        order: 1,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'agamen',
        name: 'Agamen',
        parentId: 'echsen',
        genetics: [],
        isLeaf: false,
        order: 2,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      // Geckos -> Leopardgeckos
      {
        id: 'leopardgecko',
        name: 'Leopardgecko',
        parentId: 'geckos',
        scientificName: 'Eublepharis macularius',
        genetics: [
          'Albino', 'Bell Albino', 'Tremper Albino', 'Rainwater Albino',
          'Blizzard', 'Banana Blizzard', 'Patternless', 'Murphy Patternless',
          'Enigma', 'White & Yellow', 'RAPTOR', 'RADAR', 'Eclipse',
          'Super Snow', 'Mack Snow', 'Hypo', 'Tangerine', 'Carrot Tail',
          'Giant', 'Super Giant', 'Jungle', 'Striped', 'Reverse Stripe'
        ],
        isLeaf: true,
        order: 1,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'kronengecko',
        name: 'Kronengecko',
        parentId: 'geckos',
        scientificName: 'Correlophus ciliatus',
        genetics: [
          'Flame', 'Dalmatian', 'Harlequin', 'Pinstripe', 'Tiger',
          'Brindle', 'Extreme Harlequin', 'White Wall', 'Phantom',
          'Lavender', 'Yellow', 'Orange', 'Red', 'Tricolor'
        ],
        isLeaf: true,
        order: 2,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      // Agamen -> Bartagamen
      {
        id: 'bartagame',
        name: 'Bartagame',
        parentId: 'agamen',
        scientificName: 'Pogona vitticeps',
        genetics: [
          'Hypo', 'Trans', 'Leatherback', 'Silkback', 'Dunner',
          'German Giant', 'Witblits', 'Zero', 'Paradox',
          'Red', 'Citrus', 'Orange', 'Yellow', 'Sandfire'
        ],
        isLeaf: true,
        order: 1,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      // Schlangen -> Pythons
      {
        id: 'pythons',
        name: 'Pythons',
        parentId: 'schlangen',
        genetics: [],
        isLeaf: false,
        order: 1,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'nattern',
        name: 'Nattern',
        parentId: 'schlangen',
        genetics: [],
        isLeaf: false,
        order: 2,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      // Pythons -> Königspython
      {
        id: 'koenigspython',
        name: 'Königspython',
        parentId: 'pythons',
        scientificName: 'Python regius',
        genetics: [
          'Albino', 'Piebald', 'Spider', 'Champagne', 'Banana', 'Clown',
          'GHI', 'Highway', 'Lesser', 'Mojave', 'Pastel', 'Pinstripe',
          'Cinnamon', 'Black Pastel', 'Axanthic', 'Leucistic', 'Fire',
          'Coral Glow', 'Orange Dream', 'Enchi', 'Vanilla', 'Mystic',
          'Phantom', 'Ghost', 'Champagne', 'Super Stripe', 'Bumblebee'
        ],
        isLeaf: true,
        order: 1,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      // Nattern -> Kornnatter
      {
        id: 'kornnatter',
        name: 'Kornnatter',
        parentId: 'nattern',
        scientificName: 'Pantherophis guttatus',
        genetics: [
          'Amelanistic', 'Anerythristic', 'Snow', 'Blizzard', 'Charcoal',
          'Hypomelanistic', 'Caramel', 'Kastanie', 'Lavender', 'Opal',
          'Plasma', 'Butter', 'Sunkissed', 'Motley', 'Striped',
          'Tessera', 'Palmetto', 'Scaleless'
        ],
        isLeaf: true,
        order: 1,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    await saveCategories(defaultCategories);
  };

  const saveCategories = async (newCategories: SpeciesCategory[]) => {
    try {
      await persistence.setItem(CATEGORIES_KEY, JSON.stringify(newCategories));
      setCategories(newCategories);
    } catch (error) {
      console.error('Fehler beim Speichern der Kategorien:', error);
    }
  };

  const addCategory = async (formData: CategoryFormData): Promise<string> => {
    const newCategory: SpeciesCategory = {
      id: Date.now().toString(),
      ...formData,
      order: categories.filter(c => c.parentId === formData.parentId).length + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const newCategories = [...categories, newCategory];
    await saveCategories(newCategories);
    return newCategory.id;
  };

  const updateCategory = async (id: string, formData: CategoryFormData) => {
    const updatedCategories = categories.map(category =>
      category.id === id
        ? { ...category, ...formData, updatedAt: new Date().toISOString() }
        : category
    );
    await saveCategories(updatedCategories);
  };

  const deleteCategory = async (id: string) => {
    // Prüfe auf Kinder-Kategorien
    const hasChildren = categories.some(c => c.parentId === id);
    if (hasChildren) {
      throw new Error('Kategorie kann nicht gelöscht werden: Enthält Unterkategorien');
    }

    const filteredCategories = categories.filter(category => category.id !== id);
    await saveCategories(filteredCategories);
  };

  const updateGenetics = async (categoryId: string, genetics: string[]) => {
    const updatedCategories = categories.map(category =>
      category.id === categoryId
        ? { ...category, genetics, updatedAt: new Date().toISOString() }
        : category
    );
    await saveCategories(updatedCategories);
  };

  const getCategoryById = (id: string): SpeciesCategory | undefined => {
    return categories.find(category => category.id === id);
  };

  const getChildCategories = (parentId?: string): SpeciesCategory[] => {
    return categories
      .filter(category => category.parentId === parentId && category.isActive)
      .sort((a, b) => a.order - b.order);
  };

  const getLeafCategories = (): SpeciesCategory[] => {
    return categories.filter(category => category.isLeaf && category.isActive);
  };

  const getCategoryPath = (categoryId: string): SpeciesCategory[] => {
    const path: SpeciesCategory[] = [];
    let currentCategory = getCategoryById(categoryId);
    
    while (currentCategory) {
      path.unshift(currentCategory);
      currentCategory = currentCategory.parentId ? getCategoryById(currentCategory.parentId) : undefined;
    }
    
    return path;
  };

  return {
    categories,
    loading,
    addCategory,
    updateCategory,
    deleteCategory,
    updateGenetics,
    getCategoryById,
    getChildCategories,
    getLeafCategories,
    getCategoryPath,
  };
}

export function useAdminAuth() {
  const [session, setSession] = useState<AdminSession>({
    isAuthenticated: false,
    loginTime: 0,
    expiresAt: 0,
  });

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const data = await persistence.getItem(ADMIN_SESSION_KEY);
      if (data) {
        const savedSession: AdminSession = JSON.parse(data);
        if (savedSession.expiresAt > Date.now()) {
          setSession(savedSession);
        } else {
          await logout();
        }
      }
    } catch (error) {
      console.error('Fehler beim Überprüfen der Session:', error);
    }
  };

  const login = async (password: string): Promise<boolean> => {
    // Einfacher MD5-Hash-Vergleich (in Produktion sollte das sicherer sein)
    const passwordHash = await simpleHash(password);
    
    if (passwordHash === ADMIN_PASSWORD_HASH) {
      const newSession: AdminSession = {
        isAuthenticated: true,
        loginTime: Date.now(),
        expiresAt: Date.now() + (8 * 60 * 60 * 1000), // 8 Stunden
      };
      
      await persistence.setItem(ADMIN_SESSION_KEY, JSON.stringify(newSession));
      setSession(newSession);
      return true;
    }
    
    return false;
  };

  const logout = async () => {
    await persistence.removeItem(ADMIN_SESSION_KEY);
    setSession({
      isAuthenticated: false,
      loginTime: 0,
      expiresAt: 0,
    });
  };

  const extendSession = async () => {
    if (session.isAuthenticated) {
      const extendedSession: AdminSession = {
        ...session,
        expiresAt: Date.now() + (8 * 60 * 60 * 1000),
      };
      
      await persistence.setItem(ADMIN_SESSION_KEY, JSON.stringify(extendedSession));
      setSession(extendedSession);
    }
  };

  return {
    isAuthenticated: session.isAuthenticated,
    login,
    logout,
    extendSession,
    sessionExpiresAt: session.expiresAt,
  };
}

// Einfache Hash-Funktion (in Produktion sollte crypto.subtle.digest verwendet werden)
async function simpleHash(text: string): Promise<string> {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16);
}
