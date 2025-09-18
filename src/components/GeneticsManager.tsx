
import React, { useState } from 'react';
import { useSpeciesCategories } from '../features/admin/hooks';
import { SpeciesCategory } from '../features/admin/types';
import './GeneticsManager.css';

export default function GeneticsManager() {
  const { categories, updateGenetics, getLeafCategories, getCategoryPath } = useSpeciesCategories();
  const [selectedCategory, setSelectedCategory] = useState<SpeciesCategory | null>(null);
  const [geneticsText, setGeneticsText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const leafCategories = getLeafCategories();
  const filteredCategories = leafCategories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (category.scientificName && category.scientificName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleCategorySelect = (category: SpeciesCategory) => {
    setSelectedCategory(category);
    setGeneticsText(category.genetics.join('\n'));
  };

  const handleSave = async () => {
    if (!selectedCategory) return;

    const genetics = geneticsText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    try {
      await updateGenetics(selectedCategory.id, genetics);
      // Update the selected category with new genetics
      setSelectedCategory({ ...selectedCategory, genetics });
    } catch (error) {
      alert('Fehler beim Speichern: ' + (error as Error).message);
    }
  };

  const addCommonGenetic = (genetic: string) => {
    if (!geneticsText.includes(genetic)) {
      const newText = geneticsText ? `${geneticsText}\n${genetic}` : genetic;
      setGeneticsText(newText);
    }
  };

  const getCommonGenetics = (categoryName: string): string[] => {
    // Common genetics patterns for different species
    const patterns: { [key: string]: string[] } = {
      'leopardgecko': [
        'Albino', 'Bell Albino', 'Tremper Albino', 'Rainwater Albino',
        'Blizzard', 'Banana Blizzard', 'Patternless', 'Murphy Patternless',
        'Enigma', 'White & Yellow', 'RAPTOR', 'RADAR', 'Eclipse',
        'Super Snow', 'Mack Snow', 'Hypo', 'Tangerine', 'Carrot Tail',
        'Giant', 'Super Giant', 'Jungle', 'Striped', 'Reverse Stripe'
      ],
      'bartagame': [
        'Hypo', 'Trans', 'Leatherback', 'Silkback', 'Dunner',
        'German Giant', 'Witblits', 'Zero', 'Paradox',
        'Red', 'Citrus', 'Orange', 'Yellow', 'Sandfire'
      ],
      'koenigspython': [
        'Albino', 'Piebald', 'Spider', 'Champagne', 'Banana', 'Clown',
        'GHI', 'Highway', 'Lesser', 'Mojave', 'Pastel', 'Pinstripe',
        'Cinnamon', 'Black Pastel', 'Axanthic', 'Leucistic', 'Fire'
      ],
      'kornnatter': [
        'Amelanistic', 'Anerythristic', 'Snow', 'Blizzard', 'Charcoal',
        'Hypomelanistic', 'Caramel', 'Kastanie', 'Lavender', 'Opal'
      ]
    };

    const categoryKey = categoryName.toLowerCase().replace(/[^a-z]/g, '');
    return patterns[categoryKey] || [];
  };

  return (
    <div className="genetics-manager">
      <div className="genetics-header">
        <h2>Genetik-Verwaltung</h2>
        <p>Verwalten Sie die verfügbaren Genetik-Varianten für jede Art</p>
      </div>

      <div className="genetics-content">
        <div className="category-selector">
          <h3>Arten auswählen</h3>
          
          <div className="search-box">
            <input
              type="text"
              placeholder="Art suchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="category-list">
            {filteredCategories.map(category => (
              <div
                key={category.id}
                className={`category-option ${selectedCategory?.id === category.id ? 'selected' : ''}`}
                onClick={() => handleCategorySelect(category)}
              >
                <div className="category-name">{category.name}</div>
                {category.scientificName && (
                  <div className="scientific-name">{category.scientificName}</div>
                )}
                <div className="category-path">
                  {getCategoryPath(category.id).map(c => c.name).join(' > ')}
                </div>
                <div className="genetics-count">
                  {category.genetics.length} Genetik-Varianten
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="genetics-editor">
          {selectedCategory ? (
            <>
              <div className="editor-header">
                <h3>{selectedCategory.name}</h3>
                {selectedCategory.scientificName && (
                  <p className="scientific">{selectedCategory.scientificName}</p>
                )}
              </div>

              <div className="common-genetics">
                <h4>Häufige Genetik-Varianten</h4>
                <div className="common-buttons">
                  {getCommonGenetics(selectedCategory.name).map(genetic => (
                    <button
                      key={genetic}
                      className="common-btn"
                      onClick={() => addCommonGenetic(genetic)}
                    >
                      {genetic}
                    </button>
                  ))}
                </div>
              </div>

              <div className="genetics-input-section">
                <label htmlFor="genetics-textarea">
                  Genetik-Varianten (eine pro Zeile):
                </label>
                <textarea
                  id="genetics-textarea"
                  value={geneticsText}
                  onChange={(e) => setGeneticsText(e.target.value)}
                  className="genetics-textarea"
                  placeholder="Geben Sie jede Genetik-Variante in einer neuen Zeile ein..."
                />
                <div className="textarea-info">
                  Aktuelle Anzahl: {geneticsText.split('\n').filter(line => line.trim()).length} Varianten
                </div>
              </div>

              <div className="editor-actions">
                <button
                  className="clear-btn"
                  onClick={() => setGeneticsText('')}
                >
                  Leeren
                </button>
                <button
                  className="save-btn"
                  onClick={handleSave}
                >
                  Speichern
                </button>
              </div>
            </>
          ) : (
            <div className="no-selection">
              <div className="no-selection-icon">🧬</div>
              <h3>Keine Art ausgewählt</h3>
              <p>Wählen Sie eine Art aus der Liste, um die Genetik-Varianten zu bearbeiten.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
