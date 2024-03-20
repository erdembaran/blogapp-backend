const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const db = require("./config/db");
const userRoutes = require("./routes/user");

dotenv.config();

db();

app.use(express.json());
app.use(cors());

app.use(userRoutes);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
