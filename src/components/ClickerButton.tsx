import './ClickerButton.css';

interface ClickerButtonProps {
  onClick: () => void;
  formatMoney: (amount: number) => string;
  clickValue?: number;
}

export const ClickerButton = ({ onClick, formatMoney, clickValue }: ClickerButtonProps) => {
  return (
    <div className="clicker-section">
      <button className="clicker-button" onClick={onClick}>
        <span className="clicker-emoji">💰</span>
        <span className="clicker-text">Click for Money!</span>
      </button>
      {clickValue !== undefined && clickValue > 1 && (
        <p className="clicker-value">
          +{formatMoney(clickValue)} per click
        </p>
      )}
      <p className="clicker-hint">Click the button to earn money</p>
    </div>
  );
};

