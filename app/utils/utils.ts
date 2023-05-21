import type { Amzn, Goog } from '@prisma/client';

type peaksAndTroughs = {
  peaks: number[];
  troughs: number[];
};

export function findPeaksAndTroughs(array: Amzn[] | Goog[]): peaksAndTroughs {
  var start = 1; // Starting index to search
  var end = array.length - 2; // Last index to search
  var obj: { peaks: number[]; troughs: number[] } = { peaks: [], troughs: [] }; // Object to store the indexs of peaks/thoughs

  for (var i = start; i <= end; i++) {
    var current = array[i];
    var last = array[i - 1];
    var next = array[i + 1];

    let indexPeak = false;
    let indexTrough = false;

    if (current.highestPriceOfTheDay > next.highestPriceOfTheDay && current.highestPriceOfTheDay > last.highestPriceOfTheDay) {
      indexPeak = true;
    }
    if (current.lowestPriceOfTheDay < next.lowestPriceOfTheDay && current.lowestPriceOfTheDay < last.lowestPriceOfTheDay) {
      indexTrough = true;
    }
    if (indexPeak && indexTrough) {
      continue;
    }
    if (indexPeak) {
      obj.peaks.push(i);
    }
    if (indexTrough) {
      obj.troughs.push(i);
    }
  }
  return obj;
}

export function getOperationsFromTwoStocks(initialAmount: number, amazonsStocks: Amzn[], googleStocks: Goog[]) {
  let amazonPeaksAndTroughs = findPeaksAndTroughs(amazonsStocks);
  let googlePeaksAndTroughs = findPeaksAndTroughs(googleStocks);

  let listOfOperations = [];
  let portfolio = {
    amazon: {
      stocks: 0,
      buyedAt: 0,
    },
    google: {
      stocks: 0,
      buyedAt: 0,
    },
  };

  for (let i = 0; i < amazonsStocks.length; i++) {
    // if i in troughs buy
    if (amazonPeaksAndTroughs.troughs.includes(i)) {
      if (initialAmount > amazonsStocks[i].lowestPriceOfTheDay) {
        listOfOperations.push({
          operation: 'buy',
          stock: 'amazon',
          amount: Math.floor(initialAmount / amazonsStocks[i].lowestPriceOfTheDay),
          price: amazonsStocks[i].lowestPriceOfTheDay,
          timestamp: amazonsStocks[i].timestamp,
          total: Math.floor(initialAmount / amazonsStocks[i].lowestPriceOfTheDay) * amazonsStocks[i].lowestPriceOfTheDay,
          inHands: initialAmount - Math.floor(initialAmount / amazonsStocks[i].lowestPriceOfTheDay) * amazonsStocks[i].lowestPriceOfTheDay,
        });
        portfolio.amazon.stocks = portfolio.amazon.stocks + Math.floor(initialAmount / amazonsStocks[i].lowestPriceOfTheDay);
        portfolio.amazon.buyedAt = amazonsStocks[i].lowestPriceOfTheDay;
        initialAmount = initialAmount - Math.floor(initialAmount / amazonsStocks[i].lowestPriceOfTheDay) * amazonsStocks[i].lowestPriceOfTheDay;
      }
    } else if (googlePeaksAndTroughs.troughs.includes(i)) {
      if (initialAmount > googleStocks[i].lowestPriceOfTheDay) {
        // sell amazon before buy google
        if (portfolio.amazon.stocks > 0) {
          let inHands = initialAmount + portfolio.amazon.stocks * amazonsStocks[i].highestPriceOfTheDay;
          listOfOperations.push({
            operation: 'sell',
            stock: 'amazon',
            amount: portfolio.amazon.stocks,
            price: amazonsStocks[i].highestPriceOfTheDay,
            timestamp: amazonsStocks[i].timestamp,
            total: portfolio.amazon.stocks * amazonsStocks[i].highestPriceOfTheDay,
            inHands: inHands,
          });
          initialAmount = inHands;
          portfolio.amazon.stocks = portfolio.amazon.stocks - portfolio.amazon.stocks;
        }

        listOfOperations.push({
          operation: 'buy',
          stock: 'google',
          amount: Math.floor(initialAmount / googleStocks[i].lowestPriceOfTheDay),
          price: googleStocks[i].lowestPriceOfTheDay,
          timestamp: googleStocks[i].timestamp,
          total: Math.floor(initialAmount / googleStocks[i].lowestPriceOfTheDay) * googleStocks[i].lowestPriceOfTheDay,
          inHands: initialAmount - Math.floor(initialAmount / googleStocks[i].lowestPriceOfTheDay) * googleStocks[i].lowestPriceOfTheDay,
        });
        portfolio.google.stocks = portfolio.google.stocks + Math.floor(initialAmount / googleStocks[i].lowestPriceOfTheDay);
        portfolio.google.buyedAt = googleStocks[i].lowestPriceOfTheDay;
        initialAmount = initialAmount - Math.floor(initialAmount / googleStocks[i].lowestPriceOfTheDay) * googleStocks[i].lowestPriceOfTheDay;
      }
    } else if (amazonPeaksAndTroughs.peaks.includes(i)) {
      if (portfolio.amazon.stocks > 0) {
        let inHands = initialAmount + portfolio.amazon.stocks * amazonsStocks[i].highestPriceOfTheDay;
        listOfOperations.push({
          operation: 'sell',
          stock: 'amazon',
          amount: portfolio.amazon.stocks,
          price: amazonsStocks[i].highestPriceOfTheDay,
          timestamp: amazonsStocks[i].timestamp,
          total: portfolio.amazon.stocks * amazonsStocks[i].highestPriceOfTheDay,
          inHands: inHands,
        });
        initialAmount = inHands;
        portfolio.amazon.stocks = portfolio.amazon.stocks - portfolio.amazon.stocks;
      }
    } else if (googlePeaksAndTroughs.peaks.includes(i)) {
      if (portfolio.google.stocks > 0) {
        let inHands = initialAmount + portfolio.google.stocks * googleStocks[i].highestPriceOfTheDay;
        listOfOperations.push({
          operation: 'sell',
          stock: 'google',
          amount: portfolio.google.stocks,
          price: googleStocks[i].highestPriceOfTheDay,
          timestamp: googleStocks[i].timestamp,
          total: portfolio.google.stocks * googleStocks[i].highestPriceOfTheDay,
          inHands: inHands,
        });
        initialAmount = inHands;
        portfolio.google.stocks = portfolio.google.stocks - portfolio.google.stocks;
      }
    }
  }
  return listOfOperations;
}
