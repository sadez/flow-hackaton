// import type { Amzn, Goog } from '@prisma/client';
import type { Amzn, Goog, operation, peaksAndTroughs, portfolio } from './types';

export function findPeaksAndTroughs(array: Amzn[] | Goog[]): peaksAndTroughs {
  const start = 1; // Starting index to search
  const end = array.length - 2; // Last index to search
  const obj: { peaks: number[]; troughs: number[] } = { peaks: [], troughs: [] }; // Object to store the indexs of peaks/thoughs

  if (array.length === 0) {
    return obj;
  }
  if (array.length === 1) {
    return obj;
  }

  // check if firrst element is trough
  if (array[0].lowestPriceOfTheDay < array[1].lowestPriceOfTheDay) {
    obj.troughs.push(0);
  }

  for (let i = start; i <= end; i++) {
    const current = array[i];
    const last = array[i - 1];
    const next = array[i + 1];

    let indexTrough = false;
    let indexPeak = false;

    if (current.lowestPriceOfTheDay < next.lowestPriceOfTheDay && current.lowestPriceOfTheDay < last.lowestPriceOfTheDay) {
      indexTrough = true;
    }

    if (current.highestPriceOfTheDay > next.highestPriceOfTheDay && current.highestPriceOfTheDay > last.highestPriceOfTheDay) {
      indexPeak = true;
    }

    if (indexPeak && indexTrough) {
      continue;
    }
    if (indexTrough) {
      obj.troughs.push(i);
    }
    if (indexPeak) {
      obj.peaks.push(i);
    }
  }
  return obj;
}

export function getOperationsFromTwoStocks(initialAmount: number, amazonsStocks: Amzn[], googleStocks: Goog[]) {
  const amazonPeaksAndTroughs = findPeaksAndTroughs(amazonsStocks);
  const googlePeaksAndTroughs = findPeaksAndTroughs(googleStocks);

  const length = amazonsStocks.length > googleStocks.length ? amazonsStocks.length : googleStocks.length;

  let budgetInHands = initialAmount;

  const listOfOperations: operation[] = [];
  const portfolio: portfolio = {
    amazon: {
      stocks: 0,
      buyedAt: 0,
    },
    google: {
      stocks: 0,
      buyedAt: 0,
    },
  };

  for (let i = 0; i < length; i++) {
    // if i in peaks and troughs buy the better stock
    if (amazonPeaksAndTroughs.troughs.includes(i) && googlePeaksAndTroughs.troughs.includes(i)) {
      // we will check the better stock to buy
      // get the next peak of amazon
      let nextPeakAmazon = amazonPeaksAndTroughs.peaks.find((peak) => peak > i);
      // get the next peak of google
      let nextPeakGoogle = googlePeaksAndTroughs.peaks.find((peak) => peak > i);

      if (nextPeakAmazon && nextPeakGoogle) {
        // compare the benefits of each stock
        let amazonBenefit = amazonsStocks[nextPeakAmazon].highestPriceOfTheDay - amazonsStocks[i].lowestPriceOfTheDay;
        let googleBenefit = googleStocks[nextPeakGoogle].highestPriceOfTheDay - googleStocks[i].lowestPriceOfTheDay;

        if (amazonBenefit > googleBenefit) {
          // buy amazon
          if (budgetInHands > amazonsStocks[i].lowestPriceOfTheDay) {
            let amount = Math.floor(budgetInHands / amazonsStocks[i].lowestPriceOfTheDay);
            let total = amount * amazonsStocks[i].lowestPriceOfTheDay;
            listOfOperations.push({
              operation: 'buy',
              stock: 'amazon',
              amount: amount,
              price: amazonsStocks[i].lowestPriceOfTheDay,
              timestamp: amazonsStocks[i].timestamp,
              total: total,
              inHands: budgetInHands - total,
            });
            portfolio.amazon.stocks = portfolio.amazon.stocks + amount;
            portfolio.amazon.buyedAt = amazonsStocks[i].lowestPriceOfTheDay;
            budgetInHands = budgetInHands - total;
          }
        } else {
          // buy google
          if (budgetInHands > googleStocks[i].lowestPriceOfTheDay) {
            let total = 0;
            let inHands = 0;
            // sell amazon before buy google
            if (portfolio.amazon.stocks > 0) {
              total = portfolio.amazon.stocks * amazonsStocks[i].highestPriceOfTheDay;
              inHands = budgetInHands + total;
              listOfOperations.push({
                operation: 'sell',
                stock: 'amazon',
                amount: portfolio.amazon.stocks,
                price: amazonsStocks[i].highestPriceOfTheDay,
                timestamp: amazonsStocks[i].timestamp,
                total: total,
                inHands: inHands,
              });
              budgetInHands = inHands;
              portfolio.amazon.stocks = portfolio.amazon.stocks - portfolio.amazon.stocks;
            }

            // buy google
            let amount = Math.floor(budgetInHands / googleStocks[i].lowestPriceOfTheDay);
            total = amount * googleStocks[i].lowestPriceOfTheDay;

            listOfOperations.push({
              operation: 'buy',
              stock: 'google',
              amount: amount,
              price: googleStocks[i].lowestPriceOfTheDay,
              timestamp: googleStocks[i].timestamp,
              total: total,
              inHands: budgetInHands - total,
            });
            portfolio.google.stocks = portfolio.google.stocks + amount;
            portfolio.google.buyedAt = googleStocks[i].lowestPriceOfTheDay;
            budgetInHands = budgetInHands - total;
          }
        }
      }
    }

    // if i in troughs amazonn buy amazon
    else if (amazonPeaksAndTroughs.troughs.includes(i)) {
      if (budgetInHands > amazonsStocks[i].lowestPriceOfTheDay) {
        let amount = Math.floor(budgetInHands / amazonsStocks[i].lowestPriceOfTheDay);
        let total = amount * amazonsStocks[i].lowestPriceOfTheDay;
        listOfOperations.push({
          operation: 'buy',
          stock: 'amazon',
          amount: amount,
          price: amazonsStocks[i].lowestPriceOfTheDay,
          timestamp: amazonsStocks[i].timestamp,
          total: total,
          inHands: budgetInHands - total,
        });
        portfolio.amazon.stocks = portfolio.amazon.stocks + amount;
        portfolio.amazon.buyedAt = amazonsStocks[i].lowestPriceOfTheDay;
        budgetInHands = budgetInHands - total;
      }
    }
    // if i in troughs google buy google
    else if (googlePeaksAndTroughs.troughs.includes(i)) {
      if (budgetInHands > googleStocks[i].lowestPriceOfTheDay) {
        let total = 0;
        let inHands = 0;
        // sell amazon before buy google
        if (portfolio.amazon.stocks > 0) {
          total = portfolio.amazon.stocks * amazonsStocks[i].highestPriceOfTheDay;
          inHands = budgetInHands + total;
          listOfOperations.push({
            operation: 'sell',
            stock: 'amazon',
            amount: portfolio.amazon.stocks,
            price: amazonsStocks[i].highestPriceOfTheDay,
            timestamp: amazonsStocks[i].timestamp,
            total: total,
            inHands: inHands,
          });
          budgetInHands = inHands;
          portfolio.amazon.stocks = portfolio.amazon.stocks - portfolio.amazon.stocks;
        }

        // buy google
        let amount = Math.floor(budgetInHands / googleStocks[i].lowestPriceOfTheDay);
        total = amount * googleStocks[i].lowestPriceOfTheDay;

        listOfOperations.push({
          operation: 'buy',
          stock: 'google',
          amount: amount,
          price: googleStocks[i].lowestPriceOfTheDay,
          timestamp: googleStocks[i].timestamp,
          total: total,
          inHands: budgetInHands - total,
        });
        portfolio.google.stocks = portfolio.google.stocks + amount;
        portfolio.google.buyedAt = googleStocks[i].lowestPriceOfTheDay;
        budgetInHands = budgetInHands - total;
      }
    }
    // if i in peaks amazon sell amazon
    else if (amazonPeaksAndTroughs.peaks.includes(i)) {
      if (portfolio.amazon.stocks > 0) {
        let total = portfolio.amazon.stocks * amazonsStocks[i].highestPriceOfTheDay;
        let inHands = budgetInHands + total;
        listOfOperations.push({
          operation: 'sell',
          stock: 'amazon',
          amount: portfolio.amazon.stocks,
          price: amazonsStocks[i].highestPriceOfTheDay,
          timestamp: amazonsStocks[i].timestamp,
          total: total,
          inHands: inHands,
        });
        budgetInHands = inHands;
        portfolio.amazon.stocks = portfolio.amazon.stocks - portfolio.amazon.stocks;
      }
    }
    // if i in peaks google sell google
    else if (googlePeaksAndTroughs.peaks.includes(i)) {
      if (portfolio.google.stocks > 0) {
        let total = portfolio.google.stocks * googleStocks[i].highestPriceOfTheDay;
        let inHands = budgetInHands + total;
        listOfOperations.push({
          operation: 'sell',
          stock: 'google',
          amount: portfolio.google.stocks,
          price: googleStocks[i].highestPriceOfTheDay,
          timestamp: googleStocks[i].timestamp,
          total: total,
          inHands: inHands,
        });
        budgetInHands = inHands;
        portfolio.google.stocks = portfolio.google.stocks - portfolio.google.stocks;
      }
    }
  }
  return listOfOperations;
}
