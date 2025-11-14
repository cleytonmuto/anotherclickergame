import { useState, useEffect, useCallback } from 'react';
import { GameState, Business, Upgrade } from '../types/game';
import { initialBusinesses } from '../data/businesses';
import { initialUpgrades } from '../data/upgrades';

const calculateBusinessCost = (business: Business): number => {
  return Math.floor(business.baseCost * Math.pow(1.15, business.owned));
};

// Calculate business income per cycle (baseIncome)
const calculateBusinessIncome = (business: Business, upgrades: Upgrade[]): number => {
  let income = business.baseIncome * business.owned;
  
  // Apply business-specific upgrades
  const businessUpgrades = upgrades.filter(
    u => u.businessId === business.id && u.purchased && u.type === 'income_multiplier'
  );
  businessUpgrades.forEach(upgrade => {
    income *= upgrade.multiplier || 1;
  });
  
  // Apply global upgrades
  const globalUpgrades = upgrades.filter(
    u => u.purchased && u.type === 'global_multiplier'
  );
  globalUpgrades.forEach(upgrade => {
    income *= upgrade.multiplier || 1;
  });
  
  return income;
};

// Calculate business income per second
const calculateBusinessIncomePerSecond = (business: Business, upgrades: Upgrade[]): number => {
  // Start with base income per second, multiplied by owned count
  // incomePerSecond in business data is per unit, so multiply by owned
  let incomePerSecond = business.incomePerSecond * business.owned;
  
  // Apply business-specific upgrades
  const businessUpgrades = upgrades.filter(
    u => u.businessId === business.id && u.purchased && u.type === 'income_multiplier'
  );
  businessUpgrades.forEach(upgrade => {
    incomePerSecond *= upgrade.multiplier || 1;
  });
  
  // Apply global upgrades
  const globalUpgrades = upgrades.filter(
    u => u.purchased && u.type === 'global_multiplier'
  );
  globalUpgrades.forEach(upgrade => {
    incomePerSecond *= upgrade.multiplier || 1;
  });
  
  return incomePerSecond;
};

// Calculate click value with all upgrades applied
const calculateClickValue = (upgrades: Upgrade[]): number => {
  let clickValue = 1;
  
  // Apply click-specific upgrades first
  const clickUpgrades = upgrades.filter(
    u => u.purchased && u.type === 'click_multiplier'
  );
  clickUpgrades.forEach(upgrade => {
    clickValue *= upgrade.multiplier || 1;
  });
  
  // Apply global upgrades to click value (affects everything)
  const globalUpgrades = upgrades.filter(
    u => u.purchased && u.type === 'global_multiplier'
  );
  globalUpgrades.forEach(upgrade => {
    clickValue *= upgrade.multiplier || 1;
  });
  
  return clickValue;
};

// Merge saved upgrades with initial upgrades to ensure all upgrades are available
const mergeUpgrades = (savedUpgrades: Upgrade[] | undefined, initialUpgrades: Upgrade[]): Upgrade[] => {
  if (!savedUpgrades || savedUpgrades.length === 0) {
    return initialUpgrades;
  }

  // Create a map of saved upgrades by ID for quick lookup
  const savedUpgradesMap = new Map(savedUpgrades.map(u => [u.id, u]));
  
  // Start with initial upgrades and update with saved state if it exists
  const mergedUpgrades = initialUpgrades.map(initialUpgrade => {
    const savedUpgrade = savedUpgradesMap.get(initialUpgrade.id);
    if (savedUpgrade) {
      // Use saved upgrade but preserve initial upgrade structure in case it was updated
      return {
        ...initialUpgrade,
        purchased: savedUpgrade.purchased,
        // Keep saved cost if it exists, otherwise use initial
        cost: savedUpgrade.cost !== undefined ? savedUpgrade.cost : initialUpgrade.cost,
      };
    }
    // New upgrade not in saved state, use initial
    return initialUpgrade;
  });
  
  return mergedUpgrades;
};

// Merge saved businesses with initial businesses
const mergeBusinesses = (savedBusinesses: Business[] | undefined, initialBusinesses: Business[]): Business[] => {
  if (!savedBusinesses || savedBusinesses.length === 0) {
    return initialBusinesses;
  }

  const savedBusinessesMap = new Map(savedBusinesses.map(b => [b.id, b]));
  
  return initialBusinesses.map(initialBusiness => {
    const savedBusiness = savedBusinessesMap.get(initialBusiness.id);
    if (savedBusiness) {
      return {
        ...initialBusiness,
        owned: savedBusiness.owned,
        managerHired: savedBusiness.managerHired,
        level: savedBusiness.level || initialBusiness.level,
      };
    }
    return initialBusiness;
  });
};

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = localStorage.getItem('gameState');
    if (saved) {
      try {
        const savedState = JSON.parse(saved);
        // Merge saved state with initial data to ensure all upgrades/businesses are available
        return {
          money: savedState.money || 0,
          totalMoneyEarned: savedState.totalMoneyEarned || 0,
          businesses: mergeBusinesses(savedState.businesses, initialBusinesses),
          upgrades: mergeUpgrades(savedState.upgrades, initialUpgrades),
          lastSaveTime: savedState.lastSaveTime || Date.now(),
          clicks: savedState.clicks || 0,
        };
      } catch {
        // If parsing fails, use initial state
      }
    }
    return {
      money: 0,
      totalMoneyEarned: 0,
      businesses: initialBusinesses,
      upgrades: initialUpgrades,
      lastSaveTime: Date.now(),
      clicks: 0,
    };
  });

  // Calculate passive income - businesses generate income automatically once owned
  useEffect(() => {
    const interval = setInterval(() => {
      setGameState(prev => {
        let totalIncome = 0;
        
        // Businesses generate passive income as soon as they're owned
        // Managers are visual indicators but don't affect income generation
        prev.businesses.forEach(business => {
          if (business.owned > 0) {
            // Calculate income per 100ms (interval runs every 100ms, which is 10 times per second)
            // So divide income per second by 10 to get income per 100ms
            const incomePerSecond = calculateBusinessIncomePerSecond(business, prev.upgrades);
            const incomePerTick = incomePerSecond / 10; // Convert per second to per 100ms
            totalIncome += incomePerTick;
          }
        });
        
        if (totalIncome > 0) {
          const newMoney = prev.money + totalIncome;
          return {
            ...prev,
            money: newMoney,
            totalMoneyEarned: prev.totalMoneyEarned + totalIncome,
          };
        }
        
        return prev;
      });
    }, 100); // Update every 100ms for smoother animation (10 times per second)

    return () => clearInterval(interval);
  }, []);

  const click = useCallback(() => {
    setGameState(prev => {
      const clickValue = calculateClickValue(prev.upgrades);
      
      return {
        ...prev,
        money: prev.money + clickValue,
        totalMoneyEarned: prev.totalMoneyEarned + clickValue,
        clicks: prev.clicks + 1,
      };
    });
  }, []);

  const buyBusiness = useCallback((businessId: string) => {
    setGameState(prev => {
      const businessIndex = prev.businesses.findIndex(b => b.id === businessId);
      if (businessIndex === -1) return prev;
      
      const business = prev.businesses[businessIndex];
      const cost = calculateBusinessCost(business);
      
      if (prev.money >= cost) {
        const newBusinesses = [...prev.businesses];
        newBusinesses[businessIndex] = {
          ...business,
          owned: business.owned + 1,
        };
        
        return {
          ...prev,
          money: prev.money - cost,
          businesses: newBusinesses,
        };
      }
      
      return prev;
    });
  }, []);

  const buyUpgrade = useCallback((upgradeId: string) => {
    setGameState(prev => {
      const upgradeIndex = prev.upgrades.findIndex(u => u.id === upgradeId);
      if (upgradeIndex === -1) return prev;
      
      const upgrade = prev.upgrades[upgradeIndex];
      if (upgrade.purchased || prev.money < upgrade.cost) return prev;
      
      const newUpgrades = [...prev.upgrades];
      newUpgrades[upgradeIndex] = {
        ...upgrade,
        purchased: true,
      };
      
      // If it's a manager upgrade, hire the manager
      if (upgrade.type === 'manager' && upgrade.businessId) {
        const businessIndex = prev.businesses.findIndex(b => b.id === upgrade.businessId);
        if (businessIndex !== -1) {
          const newBusinesses = [...prev.businesses];
          newBusinesses[businessIndex] = {
            ...prev.businesses[businessIndex],
            managerHired: true,
          };
          return {
            ...prev,
            money: prev.money - upgrade.cost,
            upgrades: newUpgrades,
            businesses: newBusinesses,
          };
        }
      }
      
      return {
        ...prev,
        money: prev.money - upgrade.cost,
        upgrades: newUpgrades,
      };
    });
  }, []);

  const saveGameState = useCallback((state: GameState) => {
    setGameState({
      ...state,
      lastSaveTime: Date.now(),
    });
    localStorage.setItem('gameState', JSON.stringify(state));
  }, []);

  const loadGameState = useCallback((state: GameState) => {
    // Merge loaded state with initial data to ensure all upgrades/businesses are available
    const mergedState = {
      money: state.money || 0,
      totalMoneyEarned: state.totalMoneyEarned || 0,
      businesses: mergeBusinesses(state.businesses, initialBusinesses),
      upgrades: mergeUpgrades(state.upgrades, initialUpgrades),
      lastSaveTime: state.lastSaveTime || Date.now(),
      clicks: state.clicks || 0,
    };
    setGameState(mergedState);
    localStorage.setItem('gameState', JSON.stringify(mergedState));
  }, []);

  return {
    gameState,
    click,
    buyBusiness,
    buyUpgrade,
    calculateBusinessCost,
    calculateBusinessIncome,
    calculateBusinessIncomePerSecond,
    calculateClickValue,
    saveGameState,
    loadGameState,
  };
};

