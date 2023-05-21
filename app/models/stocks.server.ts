import { db } from '~/utils/db.server';
import amazonData from "../../prisma/AMZN-stock-price.json";
import googleData from "../../prisma/GOOG-stock-price.json"; 

export function getAmazonsStocks() {    

  return amazonData
  // return db.amzn.findMany();
}

export function getGooglesStocks() {
  return googleData
  // return db.goog.findMany();
}
