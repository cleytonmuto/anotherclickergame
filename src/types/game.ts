export interface Business {
  id: string;
  name: string;
  baseCost: number;
  baseIncome: number;
  level: number;
  incomePerSecond: number;
  owned: number;
  managerHired: boolean;
}

export interface Upgrade {
  id: string;
  name: string;
  description: string;
  cost: number;
  purchased: boolean;
  businessId?: string;
  type: 'income_multiplier' | 'cost_reduction' | 'global_multiplier' | 'manager' | 'click_multiplier';
  multiplier?: number;
}

export interface GameState {
  money: number;
  totalMoneyEarned: number;
  businesses: Business[];
  upgrades: Upgrade[];
  lastSaveTime: number;
  clicks: number;
}

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

