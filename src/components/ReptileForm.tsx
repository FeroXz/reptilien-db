
import React, { useState, useEffect } from 'react';
import { ReptileFormData, Reptile } from '../features/reptiles/types';
import './ReptileForm.css';

interface ReptileFormProps {
  onSubmit: (data: ReptileFormData) => Promise<void>;
  onCancel: () => void;
  initialData?: Reptile;
  isEditing?: boolean;
}

const commonSpecies = [
  'Leopardgecko',
  'Bartagame',
  'Kornnatter',
  'Königspython',
  'Boa constrictor',
  'Grüner Leguan',
  'Gecko',
  'Chamäleon',
  'Schildkröte',
  'Andere'
];

export default function ReptileForm({ onSubmit, onCancel, initialData, isEditing = false }: ReptileFormProps) {
  const [formData, setFormData] = useState<ReptileFormData>({
    species: '',
    name: '',
    age: '',
    gender: 'unbekannt',
    price: undefined,
    genetics: '',
    origin: '',
    code: '',
    weight: undefined,
    length: undefined,
    description: '',
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        species: initialData.species,
        name: initialData.name || '',
        age: initialData.age || '',
        gender: initialData.gender,
        price: initialData.price,
        genetics: initialData.genetics || '',
        origin: initialData.origin || '',
        code: initialData.code || '',
        weight: initialData.weight,
        length: initialData.length,
        description: initialData.description || '',
      });
    }
  }, [initialData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value ? Number(value) : undefined) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reptile-form-overlay">
      <div className="reptile-form-container">
        <div className="form-header">
          <h2>{isEditing ? 'Reptil bearbeiten' : 'Neues Reptil hinzufügen'}</h2>
          <button className="close-btn" onClick={onCancel}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="reptile-form">
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="species">Art *</label>
              <select
                id="species"
                name="species"
                value={formData.species}
                onChange={handleInputChange}
                required
              >
                <option value="">Wählen Sie eine Art</option>
                {commonSpecies.map(species => (
                  <option key={species} value={species}>{species}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Individueller Name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="gender">Geschlecht</label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
              >
                <option value="unbekannt">Unbekannt</option>
                <option value="männlich">Männlich</option>
                <option value="weiblich">Weiblich</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="age">Alter</label>
              <input
                type="text"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                placeholder="z.B. 2 Jahre, Juvenile"
              />
            </div>

            <div className="form-group">
              <label htmlFor="code">Kürzel</label>
              <input
                type="text"
                id="code"
                name="code"
                value={formData.code}
                onChange={handleInputChange}
                placeholder="z.B. LG-001"
              />
            </div>

            <div className="form-group">
              <label htmlFor="price">Preis (€)</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price || ''}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                placeholder="0.00"
              />
            </div>

            <div className="form-group">
              <label htmlFor="weight">Gewicht (g)</label>
              <input
                type="number"
                id="weight"
                name="weight"
                value={formData.weight || ''}
                onChange={handleInputChange}
                min="0"
                step="0.1"
                placeholder="0.0"
              />
            </div>

            <div className="form-group">
              <label htmlFor="length">Länge (cm)</label>
              <input
                type="number"
                id="length"
                name="length"
                value={formData.length || ''}
                onChange={handleInputChange}
                min="0"
                step="0.1"
                placeholder="0.0"
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="genetics">Genetik</label>
              <input
                type="text"
                id="genetics"
                name="genetics"
                value={formData.genetics}
                onChange={handleInputChange}
                placeholder="z.B. Albino, Het Hypo"
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="origin">Herkunft</label>
              <input
                type="text"
                id="origin"
                name="origin"
                value={formData.origin}
                onChange={handleInputChange}
                placeholder="z.B. Eigene Nachzucht, Züchter XY"
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="description">Beschreibung</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                placeholder="Weitere Informationen..."
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onCancel} className="btn-secondary">
              Abbrechen
            </button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Speichern...' : isEditing ? 'Aktualisieren' : 'Hinzufügen'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
