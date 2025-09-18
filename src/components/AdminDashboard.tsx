
import React, { useState } from 'react';
import { useSpeciesCategories } from '../features/admin/hooks';
import { SpeciesCategory, CategoryFormData } from '../features/admin/types';
import CategoryManager from './CategoryManager';
import GeneticsManager from './GeneticsManager';
import DataExportImport from './DataExportImport';
import './AdminDashboard.css';

interface AdminDashboardProps {
  onClose: () => void;
  onLogout: () => void;
}

type AdminTab = 'categories' | 'genetics' | 'data' | 'overview';

export default function AdminDashboard({ onClose, onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const { categories, getChildCategories, getLeafCategories } = useSpeciesCategories();

  const rootCategories = getChildCategories();
  const leafCategories = getLeafCategories();
  const totalCategories = categories.length;
  const activeCategories = categories.filter(c => c.isActive).length;

  const getTotalGenetics = () => {
    return leafCategories.reduce((total, category) => total + category.genetics.length, 0);
  };

  return (
    <div className="admin-dashboard-overlay">
      <div className="admin-dashboard-container">
        <div className="admin-header">
          <div className="admin-header-content">
            <div className="admin-title">
              <h1>⚙️ Admin-Dashboard</h1>
              <p>Verwaltung der Reptilien-Datenbank</p>
            </div>
            <div className="admin-header-actions">
              <button className="admin-logout-btn" onClick={onLogout}>
                🚪 Abmelden
              </button>
              <button className="admin-close-btn" onClick={onClose}>
                ✕
              </button>
            </div>
          </div>
        </div>

        <div className="admin-content">
          <nav className="admin-nav">
            <button
              className={`nav-btn ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              📊 Übersicht
            </button>
            <button
              className={`nav-btn ${activeTab === 'categories' ? 'active' : ''}`}
              onClick={() => setActiveTab('categories')}
            >
              📁 Kategorien
            </button>
            <button
              className={`nav-btn ${activeTab === 'genetics' ? 'active' : ''}`}
              onClick={() => setActiveTab('genetics')}
            >
              🧬 Genetik
            </button>
            <button
              className={`nav-btn ${activeTab === 'data' ? 'active' : ''}`}
              onClick={() => setActiveTab('data')}
            >
              💾 Import/Export
            </button>
          </nav>

          <div className="admin-main">
            {activeTab === 'overview' && (
              <div className="admin-overview">
                <h2>System-Übersicht</h2>
                
                <div className="overview-stats">
                  <div className="overview-card">
                    <div className="overview-icon">📁</div>
                    <div className="overview-info">
                      <h3>Kategorien</h3>
                      <div className="overview-numbers">
                        <span className="main-number">{totalCategories}</span>
                        <span className="sub-number">davon {activeCategories} aktiv</span>
                      </div>
                    </div>
                  </div>

                  <div className="overview-card">
                    <div className="overview-icon">🦎</div>
                    <div className="overview-info">
                      <h3>Arten</h3>
                      <div className="overview-numbers">
                        <span className="main-number">{leafCategories.length}</span>
                        <span className="sub-number">verfügbare Arten</span>
                      </div>
                    </div>
                  </div>

                  <div className="overview-card">
                    <div className="overview-icon">🧬</div>
                    <div className="overview-info">
                      <h3>Genetik-Varianten</h3>
                      <div className="overview-numbers">
                        <span className="main-number">{getTotalGenetics()}</span>
                        <span className="sub-number">definierte Varianten</span>
                      </div>
                    </div>
                  </div>

                  <div className="overview-card">
                    <div className="overview-icon">🏗️</div>
                    <div className="overview-info">
                      <h3>Hierarchie-Ebenen</h3>
                      <div className="overview-numbers">
                        <span className="main-number">{rootCategories.length}</span>
                        <span className="sub-number">Hauptkategorien</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="recent-categories">
                  <h3>Zuletzt aktualisierte Kategorien</h3>
                  <div className="recent-list">
                    {categories
                      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                      .slice(0, 5)
                      .map(category => (
                        <div key={category.id} className="recent-item">
                          <span className="recent-name">{category.name}</span>
                          <span className="recent-date">
                            {new Date(category.updatedAt).toLocaleDateString('de-DE')}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>

                <div className="quick-actions">
                  <h3>Schnellaktionen</h3>
                  <div className="quick-action-buttons">
                    <button
                      className="quick-action-btn"
                      onClick={() => setActiveTab('categories')}
                    >
                      ➕ Neue Kategorie
                    </button>
                    <button
                      className="quick-action-btn"
                      onClick={() => setActiveTab('genetics')}
                    >
                      🧬 Genetik bearbeiten
                    </button>
                    <button
                      className="quick-action-btn"
                      onClick={() => setActiveTab('data')}
                    >
                      📥 Daten importieren
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'categories' && <CategoryManager />}
            {activeTab === 'genetics' && <GeneticsManager />}
            {activeTab === 'data' && <DataExportImport />}
          </div>
        </div>
      </div>
    </div>
  );
}
