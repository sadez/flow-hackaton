import { amazonMocks, googleMocks, amazonMocksPriceOneToFive, amazonMocksPriceFiveToOne, amazonMocksTenElements, amazonMocksPriceOnePeakneTrough } from 'mocks/stocks';
import { findPeaksAndTroughs, getOperationsFromTwoStocks } from '~/utils/utils';

describe('Find Peaks And Troughs of an array of Stocks price findPeaksAndTroughs ', () => {
  test('should return an empty array for an ascending array of stock prices ', () => {
    let peaksAndTroughs = findPeaksAndTroughs(amazonMocksPriceOneToFive);
    expect(peaksAndTroughs.peaks).toEqual([]);
    expect(peaksAndTroughs.troughs).toEqual([0]);
  });

  test('should return an empty array for a descending array of stock prices', () => {
    let peaksAndTroughs = findPeaksAndTroughs(amazonMocksPriceFiveToOne);
    expect(peaksAndTroughs.peaks).toEqual([]);
    expect(peaksAndTroughs.troughs).toEqual([]);
  });

  test('should return the correct peaks and troughs for an array with one peak and one trough of stock prices', () => {
    amazonMocksPriceOnePeakneTrough.sort((a, b) => a.timestamp - b.timestamp);

    let peaksAndTroughs = findPeaksAndTroughs(amazonMocksPriceOnePeakneTrough);

    expect(peaksAndTroughs.peaks).toEqual([1]);
    expect(peaksAndTroughs.troughs).toEqual([0, 3]);
  });

  test('should return the correct peaks and troughs for an array with multiple peaks and troughs of stock prices', () => {
    amazonMocksTenElements.sort((a, b) => a.timestamp - b.timestamp);

    let peaksAndTroughs = findPeaksAndTroughs(amazonMocksTenElements);

    expect(peaksAndTroughs.peaks).toEqual([1, 4, 7]);
    expect(peaksAndTroughs.troughs).toEqual([0, 3, 5]);
  });

  test('findPeaksAndTroughs should return an empty array for an input array with all equal values', () => {
    let peaksAndTroughs = findPeaksAndTroughs([
      { highestPriceOfTheDay: 1, lowestPriceOfTheDay: 1, timestamp: 1 },
      { highestPriceOfTheDay: 1, lowestPriceOfTheDay: 1, timestamp: 2 },
      { highestPriceOfTheDay: 1, lowestPriceOfTheDay: 1, timestamp: 3 },
      { highestPriceOfTheDay: 1, lowestPriceOfTheDay: 1, timestamp: 4 },
      { highestPriceOfTheDay: 1, lowestPriceOfTheDay: 1, timestamp: 5 },
    ]);
    expect(peaksAndTroughs.peaks).toEqual([]);
    expect(peaksAndTroughs.troughs).toEqual([]);
  });

  test('should return a well formated object of peaks and troughs ', () => {
    amazonMocks.sort((a, b) => a.timestamp - b.timestamp);

    let peaksAndTroughs = findPeaksAndTroughs(amazonMocks);
    // check type of peaks and troughs
    expect(Array.isArray(peaksAndTroughs.peaks)).toBe(true);
    expect(Array.isArray(peaksAndTroughs.troughs)).toBe(true);
    // check if peaks and troughs are numbers
    peaksAndTroughs.peaks.forEach((peak) => {
      expect(typeof peak).toBe('number');
    });
    peaksAndTroughs.troughs.forEach((trough) => {
      expect(typeof trough).toBe('number');
    });
  });
});

describe('test getOperationsFromTwoStocks ', () => {
  test('should return an empty array for an ascending array of stock prices ', () => {
    let operations = getOperationsFromTwoStocks(10000, [], []);
    expect(operations).toEqual([]);
  });

  test('should make operation of only one stock', () => {
    let operations = getOperationsFromTwoStocks(10000, amazonMocksTenElements, []);
    expect(operations[0].operation).toBe('buy');
  });

  test('should make operation of only one stock in second args', () => {
    let operations = getOperationsFromTwoStocks(10000, [], amazonMocksTenElements);
    expect(operations[0].operation).toBe('buy');
  });

  test('should return an empty array for a zero budget ', () => {
    let operations = getOperationsFromTwoStocks(0, amazonMocksPriceOneToFive, googleMocks);
    expect(operations).toEqual([]);
  });

  test('first operation should not be selling ', () => {
    let operations = getOperationsFromTwoStocks(10000, amazonMocksPriceOneToFive, googleMocks);
    expect(operations[0].operation).not.toBe('sell');
  });

  test('test types in result of getOperationsFromTwoStocks ', () => {
    amazonMocks.sort((a, b) => a.timestamp - b.timestamp);
    googleMocks.sort((a, b) => a.timestamp - b.timestamp);

    let operations = getOperationsFromTwoStocks(10000, amazonMocks, googleMocks);

    operations.forEach((operation, index) => {
      expect(['buy', 'sell']).toContain(operation.operation);
      expect(['amazon', 'google']).toContain(operation.stock);
      expect(operation.amount).toBeGreaterThan(0);
      expect(operation.price).toBeGreaterThan(0);
      expect(operation.timestamp).toBeGreaterThan(0);
      expect(operation.total).toBeGreaterThan(0);
      expect(operation.inHands).toBeGreaterThan(0);
    });
  });

  test('test first operation of a mock getOperationsFromTwoStocks ', () => {
    amazonMocks.sort((a, b) => a.timestamp - b.timestamp);
    googleMocks.sort((a, b) => a.timestamp - b.timestamp);

    let operations = getOperationsFromTwoStocks(10000, amazonMocks, googleMocks);

    expect(operations[0].operation).toBe('buy');
    expect(operations[0].stock).toBe('amazon');
    expect(operations[0].amount).toBe(Math.floor(10000 / 166.1605));
    expect(operations[0].price).toBe(166.1605);
    expect(operations[0].total).toBe(Math.floor(10000 / 166.1605) * 166.1605);
    expect(operations[0].inHands).toBe(10000 - Math.floor(10000 / 166.1605) * 166.1605);
    expect(10000).toBe(operations[0].inHands + operations[0].total);
  });

  test(' total in buy operations must be amount *  price', () => {
    amazonMocks.sort((a, b) => a.timestamp - b.timestamp);
    googleMocks.sort((a, b) => a.timestamp - b.timestamp);

    let operations = getOperationsFromTwoStocks(10000, amazonMocks, googleMocks);

    expect(operations[0].total).toBe(operations[0].amount * operations[0].price);
    expect(operations[2].total).toBe(operations[2].amount * operations[2].price);
    expect(operations[4].total).toBe(operations[4].amount * operations[4].price);
  });

  test(' total in sell operationss must be amount *  price', () => {
    amazonMocks.sort((a, b) => a.timestamp - b.timestamp);
    googleMocks.sort((a, b) => a.timestamp - b.timestamp);

    let operations = getOperationsFromTwoStocks(10000, amazonMocks, googleMocks);

    expect(operations[1].total).toBe(operations[1].amount * operations[1].price);
    expect(operations[3].total).toBe(operations[3].amount * operations[3].price);
    expect(operations[5].total).toBe(operations[5].amount * operations[5].price);
  });

  test(' inhands in first buy operation must be inital amout - total', () => {
    amazonMocks.sort((a, b) => a.timestamp - b.timestamp);
    googleMocks.sort((a, b) => a.timestamp - b.timestamp);

    let operations = getOperationsFromTwoStocks(10000, amazonMocks, googleMocks);

    expect(operations[0].inHands).toBe(10000 - operations[0].total);
  });

  test(' inhands in next operation after a buy operations must be inHands of last operation - total', () => {
    amazonMocks.sort((a, b) => a.timestamp - b.timestamp);
    googleMocks.sort((a, b) => a.timestamp - b.timestamp);

    let operations = getOperationsFromTwoStocks(10000, amazonMocks, googleMocks);

    expect(operations[2].inHands).toBe(operations[1].inHands - operations[2].total);
  });

  test('inhands in sell operations must be inHands of last operation + total ', () => {
    amazonMocks.sort((a, b) => a.timestamp - b.timestamp);
    googleMocks.sort((a, b) => a.timestamp - b.timestamp);

    let operations = getOperationsFromTwoStocks(10000, amazonMocks, googleMocks);

    expect(operations[1].inHands).toBe(operations[0].inHands + operations[1].total);
    expect(operations[3].inHands).toBe(operations[2].inHands + operations[3].total);
  });
});
