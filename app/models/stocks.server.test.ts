import type { Amzn, Goog } from '@prisma/client';
import { PrismaClient } from '@prisma/client';
import { amazonMocks } from 'mocks/stocks';
import { getAmazonsStocks, getGooglesStocks } from './stocks.server';

const prisma = new PrismaClient();
let amzn: Amzn | null = null;
let goog: Goog | null = null;

describe('Stock model', () => {
  beforeAll(async () => {});

  afterAll(async () => {
    await prisma.$disconnect();
  });

  test('check data amazon', async () => {
    // await prisma.amzn.create({ data: amazonMocks[0] });

    const amazonsStocks = await getAmazonsStocks(); // get from database
    // check if type is Amzn
    amazonsStocks.forEach((stock) => {
      expect(typeof stock.highestPriceOfTheDay).toBe('number'); 
      expect(typeof stock.lowestPriceOfTheDay).toBe('number');
      expect(typeof stock.timestamp).toBe('number');
      expect(stock.highestPriceOfTheDay).toBeGreaterThan(0);
      expect(stock.lowestPriceOfTheDay).toBeGreaterThan(0);
      expect(stock.highestPriceOfTheDay).toBeGreaterThanOrEqual(stock.lowestPriceOfTheDay);
      expect(stock.timestamp).toBeGreaterThan(0);
      expect(stock.timestamp).toBeLessThan(100000000000000000);
    });

  
  });

  test('check data google', async () => {
    // await prisma.goog.create({ data: amazonMocks[0] });

    const googlesStocks = await getGooglesStocks();

    // check if type is Goog
    googlesStocks.forEach((stock) => {
      expect(typeof stock.highestPriceOfTheDay).toBe('number');
      expect(typeof stock.lowestPriceOfTheDay).toBe('number');
      expect(typeof stock.timestamp).toBe('number');
      expect(stock.highestPriceOfTheDay).toBeGreaterThan(0);
      expect(stock.lowestPriceOfTheDay).toBeGreaterThan(0);
      expect(stock.highestPriceOfTheDay).toBeGreaterThanOrEqual(stock.lowestPriceOfTheDay);
      expect(stock.timestamp).toBeGreaterThan(0);
      expect(stock.timestamp).toBeLessThan(100000000000000000);
    });

  });
});
