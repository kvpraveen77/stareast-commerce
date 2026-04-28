const express = require("express");
const path = require("path");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const routes = require("./routes");

const app = express();
const swaggerDocument = YAML.load(
  path.join(__dirname, "docs", "swagger.yaml")
);

app.use(express.json());
app.use(routes);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

module.exports = app;
