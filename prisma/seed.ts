import { PrismaClient } from "@prisma/client";
import amazonData from "./AMZN-stock-price.json";
import googleData from "./GOOG-stock-price.json";

const db = new PrismaClient();

async function seed() {
  await Promise.all(
    getAmzns().map((amzn) => {
      return db.amzn.create({ data: amzn });
    })
  );
    await Promise.all(
        getGoogles().map((goog) => {
            return db.goog.create({ data: goog }); 
        })
    );
}

seed();

function getAmzns() {
  return amazonData
}

function getGoogles() {
    return googleData
}
