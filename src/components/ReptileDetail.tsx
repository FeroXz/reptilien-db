
import React from 'react';
import { Reptile } from '../features/reptiles/types';
import './ReptileDetail.css';

interface ReptileDetailProps {
  reptile: Reptile;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function ReptileDetail({ reptile, onClose, onEdit, onDelete }: ReptileDetailProps) {
  const handleDelete = () => {
    if (window.confirm('Sind Sie sicher, dass Sie dieses Reptil löschen möchten?')) {
      onDelete();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const DetailRow = ({ label, value, className = '' }: { label: string; value: any; className?: string }) => {
    if (!value && value !== 0) return null;
    
    return (
      <div className="detail-row">
        <span className="detail-label">{label}:</span>
        <span className={`detail-value ${className}`}>{value}</span>
      </div>
    );
  };

  return (
    <div className="reptile-detail-overlay">
      <div className="reptile-detail-container">
        <div className="detail-header">
          <div className="detail-title">
            <h1>{reptile.name || reptile.species}</h1>
            {reptile.name && (
              <p className="detail-species">{reptile.species}</p>
            )}
          </div>
          <div className="detail-actions">
            <button className="action-btn edit-btn" onClick={onEdit} title="Bearbeiten">
              ✏️ Bearbeiten
            </button>
            <button className="action-btn delete-btn" onClick={handleDelete} title="Löschen">
              🗑️ Löschen
            </button>
            <button className="close-btn" onClick={onClose}>×</button>
          </div>
        </div>

        <div className="detail-content">
          <div className="detail-grid">
            <div className="detail-section">
              <h3>Grundinformationen</h3>
              <div className="detail-group">
                <DetailRow label="Art" value={reptile.species} />
                <DetailRow label="Kürzel" value={reptile.code} />
                <DetailRow 
                  label="Geschlecht" 
                  value={
                    <span className={`gender-badge gender-${reptile.gender}`}>
                      {reptile.gender === 'männlich' ? '♂' : reptile.gender === 'weiblich' ? '♀' : '?'}
                      {reptile.gender}
                    </span>
                  }
                />
                <DetailRow label="Alter" value={reptile.age} />
              </div>
            </div>

            <div className="detail-section">
              <h3>Physische Daten</h3>
              <div className="detail-group">
                <DetailRow 
                  label="Gewicht" 
                  value={reptile.weight ? `${reptile.weight} g` : null} 
                />
                <DetailRow 
                  label="Länge" 
                  value={reptile.length ? `${reptile.length} cm` : null} 
                />
              </div>
            </div>

            <div className="detail-section">
              <h3>Zucht & Herkunft</h3>
              <div className="detail-group">
                <DetailRow label="Genetik" value={reptile.genetics} />
                <DetailRow label="Herkunft" value={reptile.origin} />
                <DetailRow 
                  label="Preis" 
                  value={reptile.price ? `${reptile.price}€` : null}
                  className="price" 
                />
              </div>
            </div>

            {reptile.description && (
              <div className="detail-section full-width">
                <h3>Beschreibung</h3>
                <div className="description-content">
                  {reptile.description}
                </div>
              </div>
            )}

            <div className="detail-section full-width">
              <h3>Zeitstempel</h3>
              <div className="detail-group">
                <DetailRow label="Erstellt am" value={formatDate(reptile.createdAt)} />
                <DetailRow label="Zuletzt bearbeitet" value={formatDate(reptile.updatedAt)} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
