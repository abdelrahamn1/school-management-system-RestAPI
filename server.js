const mongoose = require("mongoose");
const app = require("./app");
require("dotenv").config();

// DataBase connection
const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB).then(() => console.log(`DB connected succesfully!...`));

//server
app.listen(process.env.PORT, () => {
  console.log(`Server Running on Port ${process.env.PORT}...`);
});
