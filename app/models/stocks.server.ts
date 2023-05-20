import { db } from '~/utils/db.server';
import { Amzn, Goog } from '@prisma/client';

export function getAmazonsStocks() {    
  return db.amzn.findMany();
}

export function getGooglesStocks() {
  return db.goog.findMany();
}
