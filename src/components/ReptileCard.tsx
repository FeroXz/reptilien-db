
import React from 'react';
import { Reptile } from '../features/reptiles/types';
import './ReptileCard.css';

interface ReptileCardProps {
  reptile: Reptile;
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function ReptileCard({ reptile, onClick, onEdit, onDelete }: ReptileCardProps) {
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit();
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Sind Sie sicher, dass Sie dieses Reptil löschen möchten?')) {
      onDelete();
    }
  };

  return (
    <div className="reptile-card" onClick={onClick}>
      <div className="reptile-card-header">
        <h3 className="reptile-card-title">
          {reptile.name || reptile.species}
        </h3>
        <div className="reptile-card-actions">
          <button
            className="action-btn edit-btn"
            onClick={handleEdit}
            title="Bearbeiten"
          >
            ✏️
          </button>
          <button
            className="action-btn delete-btn"
            onClick={handleDelete}
            title="Löschen"
          >
            🗑️
          </button>
        </div>
      </div>

      <div className="reptile-card-content">
        <div className="reptile-card-info">
          <div className="info-item">
            <span className="info-label">Art:</span>
            <span className="info-value">{reptile.species}</span>
          </div>
          {reptile.code && (
            <div className="info-item">
              <span className="info-label">Kürzel:</span>
              <span className="info-value">{reptile.code}</span>
            </div>
          )}
          <div className="info-item">
            <span className="info-label">Geschlecht:</span>
            <span className={`info-value gender-${reptile.gender}`}>
              {reptile.gender === 'männlich' ? '♂' : reptile.gender === 'weiblich' ? '♀' : '?'}
              {reptile.gender}
            </span>
          </div>
          {reptile.age && (
            <div className="info-item">
              <span className="info-label">Alter:</span>
              <span className="info-value">{reptile.age}</span>
            </div>
          )}
          {reptile.price && (
            <div className="info-item">
              <span className="info-label">Preis:</span>
              <span className="info-value price">{reptile.price}€</span>
            </div>
          )}
          {reptile.genetics && (
            <div className="info-item">
              <span className="info-label">Genetik:</span>
              <span className="info-value">{reptile.genetics}</span>
            </div>
          )}
        </div>
      </div>

      <div className="reptile-card-footer">
        <span className="created-date">
          Erstellt: {new Date(reptile.createdAt).toLocaleDateString('de-DE')}
        </span>
      </div>
    </div>
  );
}
