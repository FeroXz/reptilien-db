
import { useState, useEffect } from 'react';
import { Reptile, ReptileFormData } from './types';
import { persistence } from '../../utils/persistence';

const STORAGE_KEY = 'reptile_database';

export function useReptiles() {
  const [reptiles, setReptiles] = useState<Reptile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReptiles();
  }, []);

  const loadReptiles = async () => {
    try {
      const data = await persistence.getItem(STORAGE_KEY);
      if (data) {
        setReptiles(JSON.parse(data));
      }
    } catch (error) {
      console.error('Fehler beim Laden der Reptilien:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveReptiles = async (newReptiles: Reptile[]) => {
    try {
      await persistence.setItem(STORAGE_KEY, JSON.stringify(newReptiles));
      setReptiles(newReptiles);
    } catch (error) {
      console.error('Fehler beim Speichern der Reptilien:', error);
    }
  };

  const addReptile = async (formData: ReptileFormData): Promise<string> => {
    const newReptile: Reptile = {
      id: Date.now().toString(),
      ...formData,
      images: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const newReptiles = [...reptiles, newReptile];
    await saveReptiles(newReptiles);
    return newReptile.id;
  };

  const updateReptile = async (id: string, formData: ReptileFormData) => {
    const updatedReptiles = reptiles.map(reptile =>
      reptile.id === id
        ? { ...reptile, ...formData, updatedAt: new Date().toISOString() }
        : reptile
    );
    await saveReptiles(updatedReptiles);
  };

  const deleteReptile = async (id: string) => {
    const filteredReptiles = reptiles.filter(reptile => reptile.id !== id);
    await saveReptiles(filteredReptiles);
  };

  const getReptileById = (id: string): Reptile | undefined => {
    return reptiles.find(reptile => reptile.id === id);
  };

  return {
    reptiles,
    loading,
    addReptile,
    updateReptile,
    deleteReptile,
    getReptileById,
  };
}
