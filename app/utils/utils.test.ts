import { amazonMocks, googleMocks } from 'mocks/stocks';
import { findPeaksAndTroughs, getOperationsFromTwoStocks } from '~/utils/utils';

describe('test findPeaksAndTroughs ', () => {
  test('test findPeaksAndTroughs ', () => {
    amazonMocks.sort((a, b) => a.timestamp - b.timestamp);

    let peaksAndTroughs = findPeaksAndTroughs(amazonMocks);
    expect(peaksAndTroughs.peaks).toEqual([1, 4, 7, 21, 24, 26]);
    expect(peaksAndTroughs.troughs).toEqual([3, 5, 14, 18, 22, 25]);
  });
});

describe('test getOperationsFromTwoStocks ', () => {
  test('test getOperationsFromTwoStocks ', () => {
    amazonMocks.sort((a, b) => a.timestamp - b.timestamp);
    googleMocks.sort((a, b) => a.timestamp - b.timestamp);

    let operations = getOperationsFromTwoStocks(10000, amazonMocks, googleMocks);

    operations.forEach((operation,index) => {
      expect(['buy', 'sell']).toContain(operation.operation);
      expect(['amazon', 'google']).toContain(operation.stock);
      expect(operation.amount).toBeGreaterThan(0);
      expect(operation.price).toBeGreaterThan(0);
      expect(operation.timestamp).toBeGreaterThan(0);
      expect(operation.total).toBeGreaterThan(0);
      expect(operation.inHands).toBeGreaterThan(0);

      if (operation.operation === 'buy') {
        expect(operation.total).toBe(operation.amount * operation.price);
        if(index === 0) {
          expect(operation.inHands).toBe(10000 - operation.total);
        }
        else{
          expect(operations[index-1].inHands).toBe(operation.inHands  + operation.total);

        }

      }
      if(operation.operation === 'sell') {
        expect(operation.total).toBe(operation.amount * operation.price);

        if(index === 0) {
          expect(operation.inHands).toBe(10000 + operation.total);
        }else{
          expect(operation.inHands).toBe(operations[index-1].inHands  + operation.total);

        }


      }

    });

    expect(operations[0].operation).toBe('buy');
    expect(operations[0].stock).toBe('amazon');
    expect(operations[0].amount).toBe(Math.floor(10000/161.9372));
    expect(operations[0].price).toBe(161.9372);
    expect(operations[0].total).toBe(Math.floor(10000/161.9372) * 161.9372);
    expect(operations[0].inHands).toBe(10000 - Math.floor(10000/161.9372) * 161.9372);
    expect(10000).toBe(operations[0].inHands +  operations[0].total);

    
  });
});
