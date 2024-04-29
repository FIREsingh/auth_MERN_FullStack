import dotenv from "dotenv";
import { connectDB, sqlDB } from "./config/dbConnection.js";
import { app } from "./app.js";

dotenv.config({
  path: "./env",
});

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 3000),
      () => {
        console.log(`Server is running on port: ${process.env.PORT}`);
      };
  })
  .catch((err) => {
    console.log("MongoDB connection failed: ", err);
  });

//============= sql connection ===============
sqlDB.connect((err) => {
  if (err) {
    console.error(" ==> Error connecting to MySQL database: " + err.stack);
    return;
  }
  console.log("===> Connected to MySQL database as id " + sqlDB.threadId);
});
