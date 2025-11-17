import type { Business, Upgrade } from '../types/game';
import './BusinessManager.css';

interface BusinessManagerProps {
  businesses: Business[];
  money: number;
  onBuyBusiness: (businessId: string) => void;
  calculateBusinessCost: (business: Business) => number;
  calculateBusinessIncome: (business: Business, upgrades: Upgrade[]) => number;
  calculateBusinessIncomePerSecond?: (business: Business, upgrades: Upgrade[]) => number;
  upgrades: Upgrade[];
  formatMoney: (amount: number) => string;
}

export const BusinessManager = ({
  businesses,
  money,
  onBuyBusiness,
  calculateBusinessCost,
  calculateBusinessIncome,
  calculateBusinessIncomePerSecond,
  upgrades,
  formatMoney,
}: BusinessManagerProps) => {
  // Use calculateBusinessIncomePerSecond if provided, otherwise fall back to calculating from baseIncome
  const getIncomePerSecond = (business: Business): number => {
    if (calculateBusinessIncomePerSecond) {
      return calculateBusinessIncomePerSecond(business, upgrades);
    }
    // Fallback: calculate from baseIncome (divide by 10 assuming 10-second cycle)
    return calculateBusinessIncome(business, upgrades) / 10;
  };

  return (
    <div className="business-manager">
      <h2 className="section-title">Businesses</h2>
      <div className="business-list">
        {businesses.map((business) => {
          const cost = calculateBusinessCost(business);
          const canAfford = money >= cost;
          const incomePerSecond = getIncomePerSecond(business);

          return (
            <div
              key={business.id}
              className={`business-card ${canAfford ? 'affordable' : ''} ${
                business.managerHired ? 'has-manager' : ''
              }`}
            >
              <div className="business-header">
                <h3 className="business-name">
                  <span className="business-icon">{business.icon}</span>
                  {business.name}
                </h3>
                {business.managerHired && (
                  <span className="manager-badge">👔 Manager</span>
                )}
              </div>
              <div className="business-stats">
                <div className="business-stat">
                  <span className="stat-label">Owned:</span>
                  <span className="stat-value">{business.owned}</span>
                </div>
                {business.owned > 0 && (
                  <div className="business-stat">
                    <span className="stat-label">Income/sec:</span>
                    <span className="stat-value income">
                      {formatMoney(incomePerSecond)}/s
                    </span>
                  </div>
                )}
              </div>
              <button
                className={`buy-business-btn ${canAfford ? '' : 'disabled'}`}
                onClick={() => onBuyBusiness(business.id)}
                disabled={!canAfford}
              >
                <div className="buy-btn-content">
                  <span>Buy</span>
                  <span className="buy-cost">{formatMoney(cost)}</span>
                </div>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

