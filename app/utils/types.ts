export type peaksAndTroughs = {
  peaks: number[];
  troughs: number[];
};

export type operation = {
  operation: string;
  stock: string;
  amount: number;
  price: number;
  timestamp: number;
  total: number;
  inHands: number;
};

export type portfolio = {
  amazon: {
    stocks: number;
    buyedAt: number;
  };
  google: {
    stocks: number;
    buyedAt: number;
  };
};


/**
 * Model Amzn
 * 
 */
export type Amzn = {
  v: number
  vw: number
  o: number
  c: number
  highestPriceOfTheDay: number
  lowestPriceOfTheDay: number
  timestamp: number
  n: number
}

/**
 * Model Goog
 * 
 */
export type Goog = {
  v: number
  vw: number
  o: number
  c: number
  highestPriceOfTheDay: number
  lowestPriceOfTheDay: number
  timestamp: number
  n: number
}