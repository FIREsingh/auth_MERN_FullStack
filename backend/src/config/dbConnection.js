import mongoose from "mongoose";
import { DB_Name } from "../constants.js";
import mysql from "mysql2";

//================== mongoDB Connection ========================
const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URL}/${DB_Name}`
    );
    console.log(
      `===> mongoDB connected successfully and host is:" ${connectionInstance.connection.host}`
    );
  } catch (err) {
    console.log("Mongoose connection error: => ", err);
    process.exit(1);
  }
};

//================== SQL Connection ========================
const sqlDB = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "M@9411579070ac",
  database: "dummyDatabase",
  authPlugin: "mysql_native_password",
});

export { connectDB, sqlDB };
