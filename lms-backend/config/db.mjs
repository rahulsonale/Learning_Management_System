import chalk from "chalk";
import mongoose from "mongoose";
/** @type {import("mongoose")} */
let db;
export async function connect(connectionString) {
  console.log(chalk.bgYellow("Connecting to mongo server..."));
  try {
    db = await mongoose.connect(connectionString);
    console.log(chalk.blue("Connected successfully to mongo server"));
  } catch (err) {
    console.log(chalk.redBright("Error connecting to mongo server"));
    console.log(err);
    throw err;
  }
}

export function getDB() {
  return db;
}

export async function disconnect() {
  if (db) {
    await mongoose.disconnect();
    console.log(
      "%cDisconnected successfully from mongo server",
      "color: blue;",
    );
  }
}
