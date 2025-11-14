import { Upgrade } from '../types/game';
import './UpgradePanel.css';

interface UpgradePanelProps {
  upgrades: Upgrade[];
  money: number;
  onBuyUpgrade: (upgradeId: string) => void;
  formatMoney: (amount: number) => string;
}

export const UpgradePanel = ({
  upgrades,
  money,
  onBuyUpgrade,
  formatMoney,
}: UpgradePanelProps) => {
  const availableUpgrades = upgrades.filter((u) => !u.purchased);
  const purchasedUpgrades = upgrades.filter((u) => u.purchased);

  return (
    <div className="upgrade-panel">
      <h2 className="section-title">Upgrades</h2>
      
      {availableUpgrades.length > 0 && (
        <div className="upgrade-section">
          <h3 className="upgrade-section-title">Available</h3>
          <div className="upgrade-list">
            {availableUpgrades.map((upgrade) => {
              const canAfford = money >= upgrade.cost;
              return (
                <div
                  key={upgrade.id}
                  className={`upgrade-card ${canAfford ? 'affordable' : ''}`}
                >
                  <div className="upgrade-info">
                    <h4 className="upgrade-name">{upgrade.name}</h4>
                    <p className="upgrade-description">{upgrade.description}</p>
                  </div>
                  <button
                    className={`buy-upgrade-btn ${canAfford ? '' : 'disabled'}`}
                    onClick={() => onBuyUpgrade(upgrade.id)}
                    disabled={!canAfford}
                  >
                    {formatMoney(upgrade.cost)}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {purchasedUpgrades.length > 0 && (
        <div className="upgrade-section">
          <h3 className="upgrade-section-title">Purchased</h3>
          <div className="upgrade-list purchased">
            {purchasedUpgrades.map((upgrade) => (
              <div key={upgrade.id} className="upgrade-card purchased">
                <div className="upgrade-info">
                  <h4 className="upgrade-name">
                    {upgrade.name} ✓
                  </h4>
                  <p className="upgrade-description">{upgrade.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

