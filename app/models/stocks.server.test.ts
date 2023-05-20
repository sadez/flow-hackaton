import { unSeed } from 'prisma/unSeed';
import { getAmazonsStocks, getGooglesStocks} from './stocks.server'
import  {amazonMocks}  from 'mocks/stocks'
import type { Amzn,Goog} from "@prisma/client";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
let amzn: Amzn | null = null
let goog: Goog | null = null

describe("Stock model", () => {
  beforeAll(async () => {
    await unSeed()
  })

  afterAll(async () => {
    await unSeed()
    await prisma.$disconnect()
  })

  test("can get all articles", async () => {
    await prisma.amzn.create({ data: amazonMocks[0] })
    await prisma.amzn.create({ data: amazonMocks[1] })
    await prisma.amzn.create({ data: amazonMocks[2] })
    await prisma.amzn.create({ data: amazonMocks[3] })
    

    const amazonsStocks = await getAmazonsStocks()
    console.log(amazonsStocks);
    
    expect(amazonsStocks[0].highestPriceOfTheDay).toBeGreaterThanOrEqual(100)
  })
})

