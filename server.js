const express = require("express");
const swaggerDoc = require("./swagger.json");
const swaggerUI = require("swagger-ui-express");
const app = express();
require("colors");
require("dotenv").config();
const cors = require("cors");
const ConnectMongoDB = require("./database/dbConnect");
const errorHandler = require("./middleware/errorHandler");
const auth = require("./routes/auth");
const user = require("./routes/user");
const category = require("./routes/category");
const product = require("./routes/product");
const role = require("./routes/role");
const file = require("./routes/file");

ConnectMongoDB.getConnection();

app.use(express.json());
app.use(cors());

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDoc));

app.use("/adminPanel/api/auth", auth);
app.use("/adminPanel/api/user", user);
app.use("/adminPanel/api/category", category);
app.use("/adminPanel/api/product", product);
app.use("/adminPanel/api/role", role);
app.use("/adminPanel/api/file", file);

app.use(errorHandler);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server is running on port: ${port}`));
