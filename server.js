const express = require("express");
const swaggerDoc = require("./swagger.json");
const swaggerUI = require("swagger-ui-express");
const app = express();
require("colors");
require("dotenv").config();
const cors = require("cors");
// const helmet = require("helmet");
const ConnectMongoDB = require("./database/dbConnect");
const errorHandler = require("./middleware/errorHandler");
const auth = require("./routes/auth");

ConnectMongoDB.getConnection();

app.use(express.json());
app.use(cors());
// app.use(helmet());

app.use("/adminPanel/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDoc));

app.use("/adminPanel/api/auth", auth);

app.use(errorHandler);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server is running on port: ${port}`));
