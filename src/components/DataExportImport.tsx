
import React, { useState } from 'react';
import { useReptiles } from '../features/reptiles/hooks';
import { useSpeciesCategories } from '../features/admin/hooks';
import { persistence } from '../utils/persistence';
import './DataExportImport.css';

export default function DataExportImport() {
  const { reptiles } = useReptiles();
  const { categories } = useSpeciesCategories();
  const [importData, setImportData] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const exportData = () => {
    const data = {
      reptiles,
      categories,
      exportDate: new Date().toISOString(),
      version: '1.0',
    };

    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `reptilien-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setMessage('✅ Daten erfolgreich exportiert!');
    setTimeout(() => setMessage(''), 3000);
  };

  const importDataFromFile = async () => {
    if (!importData.trim()) {
      setMessage('❌ Bitte fügen Sie JSON-Daten ein');
      return;
    }

    setLoading(true);
    try {
      const data = JSON.parse(importData);
      
      // Validierung
      if (!data.reptiles || !data.categories) {
        throw new Error('Ungültiges Datenformat');
      }

      // Backup aktuelle Daten
      const currentReptiles = await persistence.getItem('reptile_database');
      const currentCategories = await persistence.getItem('species_categories');
      
      if (currentReptiles || currentCategories) {
        const backupData = {
          reptiles: currentReptiles ? JSON.parse(currentReptiles) : [],
          categories: currentCategories ? JSON.parse(currentCategories) : [],
          backupDate: new Date().toISOString(),
        };
        await persistence.setItem('backup_before_import', JSON.stringify(backupData));
      }

      // Importiere neue Daten
      await persistence.setItem('reptile_database', JSON.stringify(data.reptiles));
      await persistence.setItem('species_categories', JSON.stringify(data.categories));

      setMessage('✅ Daten erfolgreich importiert! Seite wird neu geladen...');
      setTimeout(() => {
        window.location.reload();
      }, 2000);

    } catch (error) {
      setMessage('❌ Fehler beim Importieren: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const clearAllData = async () => {
    if (!window.confirm(
      'WARNUNG: Dies löscht alle Daten unwiderruflich!\n\n' +
      'Sind Sie sicher, dass Sie alle Reptilien und Kategorien löschen möchten?'
    )) {
      return;
    }

    if (!window.confirm('Letzte Warnung: Alle Daten werden gelöscht!')) {
      return;
    }

    setLoading(true);
    try {
      await persistence.clear();
      setMessage('✅ Alle Daten gelöscht. Seite wird neu geladen...');
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      setMessage('❌ Fehler beim Löschen: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const restoreBackup = async () => {
    try {
      const backupData = await persistence.getItem('backup_before_import');
      if (!backupData) {
        setMessage('❌ Kein Backup gefunden');
        return;
      }

      const data = JSON.parse(backupData);
      await persistence.setItem('reptile_database', JSON.stringify(data.reptiles));
      await persistence.setItem('species_categories', JSON.stringify(data.categories));

      setMessage('✅ Backup wiederhergestellt. Seite wird neu geladen...');
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      setMessage('❌ Fehler beim Wiederherstellen: ' + (error as Error).message);
    }
  };

  const generateSampleData = () => {
    const sampleData = {
      reptiles: [
        {
          id: `sample-${Date.now()}`,
          species: 'Leopardgecko',
          name: 'Beispiel Gecko',
          gender: 'männlich' as const,
          age: '2 Jahre',
          genetics: 'Albino',
          origin: 'Beispiel-Zucht',
          price: 150,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      ],
      categories: categories,
      exportDate: new Date().toISOString(),
      version: '1.0',
    };

    setImportData(JSON.stringify(sampleData, null, 2));
    setMessage('📄 Beispieldaten generiert');
  };

  return (
    <div className="data-export-import">
      <div className="data-header">
        <h2>Daten Import/Export</h2>
        <p>Sichern und wiederherstellen Sie Ihre Reptilien-Datenbank</p>
      </div>

      {message && (
        <div className={`message ${message.includes('❌') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      <div className="data-sections">
        <div className="data-section">
          <h3>📤 Daten exportieren</h3>
          <p>Erstellen Sie eine Sicherungskopie Ihrer kompletten Datenbank.</p>
          
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-number">{reptiles.length}</span>
              <span className="stat-label">Reptilien</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{categories.length}</span>
              <span className="stat-label">Kategorien</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">
                {categories.filter(c => c.isLeaf).reduce((sum, c) => sum + c.genetics.length, 0)}
              </span>
              <span className="stat-label">Genetik-Varianten</span>
            </div>
          </div>

          <button
            className="export-btn"
            onClick={exportData}
            disabled={loading}
          >
            💾 Daten exportieren
          </button>
        </div>

        <div className="data-section">
          <h3>📥 Daten importieren</h3>
          <p>Laden Sie eine Sicherungskopie oder externe Daten hoch.</p>
          
          <div className="import-actions">
            <button
              className="sample-btn"
              onClick={generateSampleData}
              disabled={loading}
            >
              📄 Beispieldaten generieren
            </button>
          </div>

          <div className="import-textarea-container">
            <label htmlFor="import-data">JSON-Daten einfügen:</label>
            <textarea
              id="import-data"
              value={importData}
              onChange={(e) => setImportData(e.target.value)}
              rows={12}
              placeholder="Fügen Sie hier die JSON-Daten ein..."
              className="import-textarea"
              disabled={loading}
            />
          </div>

          <div className="import-actions">
            <button
              className="clear-input-btn"
              onClick={() => setImportData('')}
              disabled={loading}
            >
              🗑️ Eingabe löschen
            </button>
            <button
              className="import-btn"
              onClick={importDataFromFile}
              disabled={loading || !importData.trim()}
            >
              {loading ? '⏳ Importiere...' : '📥 Daten importieren'}
            </button>
          </div>

          <div className="import-warning">
            ⚠️ <strong>Wichtig:</strong> Der Import überschreibt alle vorhandenen Daten. 
            Exportieren Sie zuerst eine Sicherungskopie!
          </div>
        </div>

        <div className="data-section">
          <h3>🔧 Datenbank-Verwaltung</h3>
          <p>Erweiterte Funktionen für die Datenbank-Verwaltung.</p>

          <div className="management-actions">
            <button
              className="restore-btn"
              onClick={restoreBackup}
              disabled={loading}
            >
              ↩️ Letztes Backup wiederherstellen
            </button>
            
            <button
              className="danger-btn"
              onClick={clearAllData}
              disabled={loading}
            >
              ⚠️ Alle Daten löschen
            </button>
          </div>

          <div className="info-box">
            <h4>💡 Tipps</h4>
            <ul>
              <li>Exportieren Sie regelmäßig Backups</li>
              <li>Testen Sie Imports zuerst mit Beispieldaten</li>
              <li>Backup-Dateien sind mit Datum benannt</li>
              <li>Bei Import-Fehlern wird automatisch ein Backup erstellt</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
