const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const db = require("./config/db");
const userRoutes = require("./routes/user");
const postRoutes = require("./routes/post");
const errorHandler = require("./middleware/error");
const helmet = require("helmet");
const compression = require("compression");
const app = express();

app.use(helmet());
app.use(compression());

dotenv.config();

db();

app.use(express.json());
app.use(cors());

app.use("/api/users", userRoutes);
app.use("/api/blogs", postRoutes);

app.use(errorHandler);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
