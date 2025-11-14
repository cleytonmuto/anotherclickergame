import { useAuth } from '../contexts/AuthContext';
import './UserPanel.css';

interface UserPanelProps {
  money: number;
  totalIncomePerSecond: number;
  clicks: number;
  clickValue?: number;
  formatMoney: (amount: number) => string;
  onManualSave: () => void;
  lastSaveTime: number | null;
  autoSaveEnabled: boolean;
  onToggleAutoSave: () => void;
}

export const UserPanel = ({
  money,
  totalIncomePerSecond,
  clicks,
  clickValue,
  formatMoney,
  onManualSave,
  lastSaveTime,
  autoSaveEnabled,
  onToggleAutoSave,
}: UserPanelProps) => {
  const { currentUser, signOut } = useAuth();

  const formatTime = (timestamp: number | null): string => {
    if (!timestamp) return 'Never';
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    return `${Math.floor(seconds / 3600)}h ago`;
  };

  return (
    <div className="user-panel">
      <div className="user-header">
        <div className="user-info">
          {currentUser?.photoURL && (
            <img
              src={currentUser.photoURL}
              alt="Profile"
              className="user-avatar"
            />
          )}
          <div className="user-details">
            <div className="user-name">
              {currentUser?.displayName || 'Player'}
            </div>
            <div className="user-email">{currentUser?.email}</div>
          </div>
        </div>
        <button className="sign-out-btn" onClick={signOut}>
          Sign Out
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card money">
          <div className="stat-label">Money</div>
          <div className="stat-value">{formatMoney(money)}</div>
        </div>
        <div className="stat-card income">
          <div className="stat-label">Income/sec</div>
          <div className="stat-value">
            {formatMoney(totalIncomePerSecond)}/s
          </div>
        </div>
        {clickValue !== undefined && clickValue > 1 && (
          <div className="stat-card click-value">
            <div className="stat-label">Click Value</div>
            <div className="stat-value">+{formatMoney(clickValue)}</div>
          </div>
        )}
        <div className="stat-card clicks">
          <div className="stat-label">Total Clicks</div>
          <div className="stat-value">{clicks.toLocaleString()}</div>
        </div>
      </div>

      <div className="save-controls">
        <button className="save-btn" onClick={onManualSave}>
          💾 Save Now
        </button>
        <label className="autosave-toggle">
          <input
            type="checkbox"
            checked={autoSaveEnabled}
            onChange={onToggleAutoSave}
          />
          <span>Auto-save</span>
        </label>
        {lastSaveTime && (
          <div className="last-save">
            Last saved: {formatTime(lastSaveTime)}
          </div>
        )}
      </div>
    </div>
  );
};

