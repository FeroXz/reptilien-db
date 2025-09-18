
import React, { useState } from 'react';
import './AdminLogin.css';

interface AdminLoginProps {
  onLogin: (password: string) => Promise<boolean>;
  onCancel: () => void;
}

export default function AdminLogin({ onLogin, onCancel }: AdminLoginProps) {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const success = await onLogin(password);
      if (!success) {
        setError('Ungültiges Passwort');
        setPassword('');
      }
    } catch (error) {
      setError('Anmeldung fehlgeschlagen');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-overlay">
      <div className="admin-login-container">
        <div className="login-header">
          <h2>🔐 Admin-Bereich</h2>
          <p>Geben Sie das Administrator-Passwort ein</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="password">Passwort</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Administrator-Passwort"
              required
              autoFocus
              disabled={loading}
            />
          </div>

          {error && (
            <div className="error-message">
              ⚠️ {error}
            </div>
          )}

          <div className="login-actions">
            <button type="button" onClick={onCancel} disabled={loading}>
              Abbrechen
            </button>
            <button type="submit" disabled={loading || !password}>
              {loading ? 'Anmelden...' : 'Anmelden'}
            </button>
          </div>
        </form>

        <div className="login-info">
          <p>👤 <strong>Demo-Zugang:</strong></p>
          <p>Passwort: <code>admin123</code></p>
          <small>⚠️ In der Produktionsversion sollte ein sicheres Passwort verwendet werden</small>
        </div>
      </div>
    </div>
  );
}
