import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useGameState } from '../hooks/useGameState';
import { saveGameToFirebase, loadGameFromFirebase } from '../services/firebaseService';
import { ClickerButton } from './ClickerButton';
import { BusinessManager } from './BusinessManager';
import { UpgradePanel } from './UpgradePanel';
import { UserPanel } from './UserPanel';
import './Game.css';

export const Game = () => {
  const { currentUser } = useAuth();
  const {
    gameState,
    click,
    buyBusiness,
    buyUpgrade,
    calculateBusinessCost,
    calculateBusinessIncome,
    calculateBusinessIncomePerSecond,
    calculateClickValue,
    loadGameState,
  } = useGameState();

  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [lastSaveTime, setLastSaveTime] = useState<number | null>(null);

  // Load game from Firebase on mount
  useEffect(() => {
    if (currentUser) {
      loadGameFromFirebase(currentUser.uid)
        .then((savedState) => {
          if (savedState) {
            loadGameState(savedState);
            setLastSaveTime(savedState.lastSaveTime);
          }
        })
        .catch((error) => {
          console.error('Failed to load game from Firebase:', error);
        });
    }
  }, [currentUser, loadGameState]);

  // Auto-save to Firebase every 30 seconds
  useEffect(() => {
    if (!currentUser || !autoSaveEnabled) return;

    const interval = setInterval(() => {
      saveGameToFirebase(currentUser.uid, gameState)
        .then(() => {
          setLastSaveTime(Date.now());
        })
        .catch((error) => {
          console.error('Failed to auto-save game:', error);
        });
    }, 30000); // Save every 30 seconds

    return () => clearInterval(interval);
  }, [currentUser, gameState, autoSaveEnabled]);

  // Manual save function
  const handleManualSave = async () => {
    if (!currentUser) return;

    try {
      await saveGameToFirebase(currentUser.uid, gameState);
      setLastSaveTime(Date.now());
      alert('Game saved successfully!');
    } catch (error) {
      console.error('Failed to save game:', error);
      alert('Failed to save game. Please try again.');
    }
  };

  // Format money display
  const formatMoney = (amount: number): string => {
    if (amount >= 1e12) return `$${(amount / 1e12).toFixed(2)}T`;
    if (amount >= 1e9) return `$${(amount / 1e9).toFixed(2)}B`;
    if (amount >= 1e6) return `$${(amount / 1e6).toFixed(2)}M`;
    if (amount >= 1e3) return `$${(amount / 1e3).toFixed(2)}K`;
    return `$${amount.toFixed(2)}`;
  };

  // Calculate total income per second - businesses generate income as soon as they're owned
  const totalIncomePerSecond = gameState.businesses.reduce((total, business) => {
    if (business.owned > 0) {
      return total + calculateBusinessIncomePerSecond(business, gameState.upgrades);
    }
    return total;
  }, 0);

  // Calculate current click value
  const clickValue = calculateClickValue(gameState.upgrades);

  return (
    <div className="game-container">
      <UserPanel
        money={gameState.money}
        totalIncomePerSecond={totalIncomePerSecond}
        clicks={gameState.clicks}
        clickValue={clickValue}
        formatMoney={formatMoney}
        onManualSave={handleManualSave}
        lastSaveTime={lastSaveTime}
        autoSaveEnabled={autoSaveEnabled}
        onToggleAutoSave={() => setAutoSaveEnabled(!autoSaveEnabled)}
      />

      <div className="game-main">
        <div className="game-left">
          <ClickerButton onClick={click} formatMoney={formatMoney} clickValue={clickValue} />
          <BusinessManager
            businesses={gameState.businesses}
            money={gameState.money}
            onBuyBusiness={buyBusiness}
            calculateBusinessCost={calculateBusinessCost}
            calculateBusinessIncome={calculateBusinessIncome}
            calculateBusinessIncomePerSecond={calculateBusinessIncomePerSecond}
            upgrades={gameState.upgrades}
            formatMoney={formatMoney}
          />
        </div>

        <div className="game-right">
          <UpgradePanel
            upgrades={gameState.upgrades}
            money={gameState.money}
            onBuyUpgrade={buyUpgrade}
            formatMoney={formatMoney}
          />
        </div>
      </div>
    </div>
  );
};

