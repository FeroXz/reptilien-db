
import React, { useState } from 'react';
import { useSpeciesCategories } from '../features/admin/hooks';
import { SpeciesCategory, CategoryFormData } from '../features/admin/types';
import './CategoryManager.css';

export default function CategoryManager() {
  const {
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    getCategoryById,
    getChildCategories,
    getCategoryPath,
  } = useSpeciesCategories();

  const [editingCategory, setEditingCategory] = useState<SpeciesCategory | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    parentId: undefined,
    genetics: [],
    description: '',
    commonNames: [],
    scientificName: '',
    isLeaf: false,
    isActive: true,
  });

  const rootCategories = getChildCategories();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, formData);
      } else {
        await addCategory(formData);
      }
      resetForm();
    } catch (error) {
      alert('Fehler beim Speichern: ' + (error as Error).message);
    }
  };

  const handleEdit = (category: SpeciesCategory) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      parentId: category.parentId,
      genetics: [...category.genetics],
      description: category.description || '',
      commonNames: category.commonNames || [],
      scientificName: category.scientificName || '',
      isLeaf: category.isLeaf,
      isActive: category.isActive,
    });
    setShowForm(true);
  };

  const handleDelete = async (category: SpeciesCategory) => {
    if (window.confirm(`Sind Sie sicher, dass Sie "${category.name}" löschen möchten?`)) {
      try {
        await deleteCategory(category.id);
      } catch (error) {
        alert('Fehler beim Löschen: ' + (error as Error).message);
      }
    }
  };

  const resetForm = () => {
    setEditingCategory(null);
    setShowForm(false);
    setFormData({
      name: '',
      parentId: undefined,
      genetics: [],
      description: '',
      commonNames: [],
      scientificName: '',
      isLeaf: false,
      isActive: true,
    });
  };

  const toggleExpanded = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const renderCategoryTree = (parentId?: string, level = 0) => {
    const children = getChildCategories(parentId);
    
    return children.map(category => {
      const hasChildren = getChildCategories(category.id).length > 0;
      const isExpanded = expandedCategories.has(category.id);
      
      return (
        <div key={category.id} className="category-item">
          <div className={`category-content level-${level}`}>
            <div className="category-main">
              <div className="category-toggle">
                {hasChildren ? (
                  <button
                    className="toggle-btn"
                    onClick={() => toggleExpanded(category.id)}
                  >
                    {isExpanded ? '▼' : '▶'}
                  </button>
                ) : (
                  <span className="toggle-spacer">•</span>
                )}
              </div>
              
              <div className="category-info">
                <div className="category-header">
                  <h4 className="category-name">
                    {category.name}
                    {category.isLeaf && <span className="leaf-badge">Art</span>}
                    {!category.isActive && <span className="inactive-badge">Inaktiv</span>}
                  </h4>
                  {category.scientificName && (
                    <span className="scientific-name">{category.scientificName}</span>
                  )}
                </div>
                
                {category.description && (
                  <p className="category-description">{category.description}</p>
                )}
                
                {category.genetics.length > 0 && (
                  <div className="genetics-preview">
                    <strong>Genetik ({category.genetics.length}):</strong>
                    <span className="genetics-list">
                      {category.genetics.slice(0, 3).join(', ')}
                      {category.genetics.length > 3 && '...'}
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="category-actions">
              <button
                className="edit-btn"
                onClick={() => handleEdit(category)}
                title="Bearbeiten"
              >
                ✏️
              </button>
              <button
                className="delete-btn"
                onClick={() => handleDelete(category)}
                title="Löschen"
              >
                🗑️
              </button>
            </div>
          </div>
          
          {isExpanded && hasChildren && (
            <div className="category-children">
              {renderCategoryTree(category.id, level + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="category-manager">
      <div className="manager-header">
        <h2>Kategorien-Verwaltung</h2>
        <button
          className="add-category-btn"
          onClick={() => setShowForm(true)}
        >
          ➕ Neue Kategorie
        </button>
      </div>

      <div className="category-tree">
        {rootCategories.length === 0 ? (
          <div className="empty-categories">
            <p>Keine Kategorien vorhanden.</p>
            <button
              className="add-first-btn"
              onClick={() => setShowForm(true)}
            >
              Erste Kategorie erstellen
            </button>
          </div>
        ) : (
          renderCategoryTree()
        )}
      </div>

      {showForm && (
        <div className="form-overlay">
          <div className="form-container">
            <h3>{editingCategory ? 'Kategorie bearbeiten' : 'Neue Kategorie'}</h3>
            
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Übergeordnete Kategorie</label>
                  <select
                    value={formData.parentId || ''}
                    onChange={(e) => setFormData({ ...formData, parentId: e.target.value || undefined })}
                  >
                    <option value="">Hauptkategorie</option>
                    {categories
                      .filter(c => !c.isLeaf && c.id !== editingCategory?.id)
                      .map(category => (
                        <option key={category.id} value={category.id}>
                          {getCategoryPath(category.id).map(c => c.name).join(' > ')}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Wissenschaftlicher Name</label>
                  <input
                    type="text"
                    value={formData.scientificName}
                    onChange={(e) => setFormData({ ...formData, scientificName: e.target.value })}
                    placeholder="z.B. Eublepharis macularius"
                  />
                </div>

                <div className="form-group">
                  <label>Beschreibung</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="form-group checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.isLeaf}
                      onChange={(e) => setFormData({ ...formData, isLeaf: e.target.checked })}
                    />
                    <span>Ist eine Art (kann Reptilien enthalten)</span>
                  </label>
                </div>

                <div className="form-group checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    />
                    <span>Aktiv</span>
                  </label>
                </div>
              </div>

              <div className="form-actions">
                <button type="button" onClick={resetForm}>
                  Abbrechen
                </button>
                <button type="submit">
                  {editingCategory ? 'Aktualisieren' : 'Erstellen'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
