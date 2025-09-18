
import React, { useState } from 'react';
import { useReptiles } from './features/reptiles/hooks';
import { useAdminAuth, useSpeciesCategories } from './features/admin/hooks';
import { Reptile, ReptileFormData } from './features/reptiles/types';
import ReptileCard from './components/ReptileCard';
import ReptileForm from './components/ReptileForm';
import ReptileDetail from './components/ReptileDetail';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import './App.css';

type AppView = 'list' | 'detail' | 'add' | 'edit' | 'admin-login' | 'admin-dashboard';

function App() {
  const { reptiles, loading, addReptile, updateReptile, deleteReptile, getReptileById } = useReptiles();
  const { isAuthenticated, login, logout } = useAdminAuth();
  const { getLeafCategories } = useSpeciesCategories();
  
  const [currentView, setCurrentView] = useState<AppView>('list');
  const [selectedReptileId, setSelectedReptileId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'species' | 'created' | 'price'>('created');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const selectedReptile = selectedReptileId ? getReptileById(selectedReptileId) : null;
  const speciesCategories = getLeafCategories();

  // Filter and sort reptiles
  const filteredAndSortedReptiles = reptiles
    .filter(reptile => {
      if (!searchTerm) return true;
      const search = searchTerm.toLowerCase();
      return (
        reptile.species.toLowerCase().includes(search) ||
        (reptile.name && reptile.name.toLowerCase().includes(search)) ||
        (reptile.genetics && reptile.genetics.toLowerCase().includes(search)) ||
        (reptile.code && reptile.code.toLowerCase().includes(search))
      );
    })
    .sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortBy) {
        case 'name':
          aValue = a.name || a.species;
          bValue = b.name || b.species;
          break;
        case 'species':
          aValue = a.species;
          bValue = b.species;
          break;
        case 'price':
          aValue = a.price || 0;
          bValue = b.price || 0;
          break;
        case 'created':
        default:
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
      }

      if (typeof aValue === 'string') {
        const comparison = aValue.localeCompare(bValue);
        return sortOrder === 'asc' ? comparison : -comparison;
      } else {
        const comparison = aValue - bValue;
        return sortOrder === 'asc' ? comparison : -comparison;
      }
    });

  const handleAddReptile = async (formData: ReptileFormData) => {
    const id = await addReptile(formData);
    setSelectedReptileId(id);
    setCurrentView('detail');
  };

  const handleUpdateReptile = async (formData: ReptileFormData) => {
    if (selectedReptileId) {
      await updateReptile(selectedReptileId, formData);
      setCurrentView('detail');
    }
  };

  const handleDeleteReptile = async (id: string) => {
    await deleteReptile(id);
    if (selectedReptileId === id) {
      setSelectedReptileId(null);
      setCurrentView('list');
    }
  };

  const handleReptileClick = (reptile: Reptile) => {
    setSelectedReptileId(reptile.id);
    setCurrentView('detail');
  };

  const handleEditClick = (reptile: Reptile) => {
    setSelectedReptileId(reptile.id);
    setCurrentView('edit');
  };

  const handleCloseModal = () => {
    setCurrentView('list');
    setSelectedReptileId(null);
  };

  const handleAdminLogin = async (password: string): Promise<boolean> => {
    const success = await login(password);
    if (success) {
      setCurrentView('admin-dashboard');
    }
    return success;
  };

  const handleAdminLogout = async () => {
    await logout();
    setCurrentView('list');
  };

  const toggleSortOrder = () => {
    setSortOrder(current => current === 'asc' ? 'desc' : 'asc');
  };

  if (loading) {
    return (
      <div className="app-loading">
        <div className="loading-spinner"></div>
        <p>Lade Reptilien-Datenbank...</p>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="header-title">
            <h1>🦎 Reptilien-Datenbank</h1>
            <p>Verwaltung Ihrer Reptiliensammlung</p>
          </div>
          <div className="header-actions">
            <button
              className="add-button"
              onClick={() => setCurrentView('add')}
            >
              ➕ Neues Reptil hinzufügen
            </button>
            {isAuthenticated ? (
              <div className="admin-controls">
                <button
                  className="admin-button authenticated"
                  onClick={() => setCurrentView('admin-dashboard')}
                  title="Admin-Dashboard"
                >
                  ⚙️ Admin
                </button>
                <button
                  className="admin-logout-button"
                  onClick={handleAdminLogout}
                  title="Abmelden"
                >
                  🚪 Logout
                </button>
              </div>
            ) : (
              <button
                className="admin-button"
                onClick={() => setCurrentView('admin-login')}
                title="Admin-Bereich"
              >
                ⚙️
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="app-main">
        <div className="controls-section">
          <div className="search-section">
            <div className="search-input-container">
              <input
                type="text"
                placeholder="Suchen nach Art, Name, Genetik oder Kürzel..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              {searchTerm && (
                <button
                  className="clear-search"
                  onClick={() => setSearchTerm('')}
                  title="Suche löschen"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          <div className="sort-section">
            <label htmlFor="sort-select">Sortieren nach:</label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="sort-select"
            >
              <option value="created">Erstellungsdatum</option>
              <option value="name">Name</option>
              <option value="species">Art</option>
              <option value="price">Preis</option>
            </select>
            <button
              className="sort-order-btn"
              onClick={toggleSortOrder}
              title={`Sortierung: ${sortOrder === 'asc' ? 'Aufsteigend' : 'Absteigend'}`}
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>

        <div className="stats-section">
          <div className="stat-card">
            <span className="stat-number">{reptiles.length}</span>
            <span className="stat-label">Reptilien gesamt</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{filteredAndSortedReptiles.length}</span>
            <span className="stat-label">Gefiltert angezeigt</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">
              {reptiles.filter(r => r.gender === 'männlich').length}
            </span>
            <span className="stat-label">Männlich ♂</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">
              {reptiles.filter(r => r.gender === 'weiblich').length}
            </span>
            <span className="stat-label">Weiblich ♀</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{speciesCategories.length}</span>
            <span className="stat-label">Arten verfügbar</span>
          </div>
        </div>

        {filteredAndSortedReptiles.length === 0 ? (
          <div className="empty-state">
            {reptiles.length === 0 ? (
              <>
                <div className="empty-icon">🦎</div>
                <h2>Willkommen in Ihrer Reptilien-Datenbank!</h2>
                <p>Sie haben noch keine Reptilien hinzugefügt.</p>
                <button
                  className="add-button-large"
                  onClick={() => setCurrentView('add')}
                >
                  Erstes Reptil hinzufügen
                </button>
              </>
            ) : (
              <>
                <div className="empty-icon">🔍</div>
                <h2>Keine Ergebnisse gefunden</h2>
                <p>Versuchen Sie andere Suchbegriffe oder löschen Sie den Filter.</p>
                <button
                  className="clear-search-btn"
                  onClick={() => setSearchTerm('')}
                >
                  Filter zurücksetzen
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="reptiles-grid">
            {filteredAndSortedReptiles.map(reptile => (
              <ReptileCard
                key={reptile.id}
                reptile={reptile}
                onClick={() => handleReptileClick(reptile)}
                onEdit={() => handleEditClick(reptile)}
                onDelete={() => handleDeleteReptile(reptile.id)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modals */}
      {currentView === 'add' && (
        <ReptileForm
          onSubmit={handleAddReptile}
          onCancel={handleCloseModal}
          categories={speciesCategories}
        />
      )}

      {currentView === 'edit' && selectedReptile && (
        <ReptileForm
          onSubmit={handleUpdateReptile}
          onCancel={handleCloseModal}
          initialData={selectedReptile}
          categories={speciesCategories}
          isEditing={true}
        />
      )}

      {currentView === 'detail' && selectedReptile && (
        <ReptileDetail
          reptile={selectedReptile}
          onClose={handleCloseModal}
          onEdit={() => setCurrentView('edit')}
          onDelete={() => handleDeleteReptile(selectedReptile.id)}
        />
      )}

      {currentView === 'admin-login' && (
        <AdminLogin
          onLogin={handleAdminLogin}
          onCancel={handleCloseModal}
        />
      )}

      {currentView === 'admin-dashboard' && isAuthenticated && (
        <AdminDashboard
          onClose={handleCloseModal}
          onLogout={handleAdminLogout}
        />
      )}
    </div>
  );
}

export default App;
