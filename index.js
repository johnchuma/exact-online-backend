const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const UserRoutes = require("./modules/users/users.routes");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger-output.json");
const { usersTag } = require("./utils/apiSwaggerTags");
const { ordersTag } = require("./utils/apiSwaggerTags");
// const responseTime = require("express-response-time");
// app.use(responseTime());
app.use("/files", express.static("files"));
app.use("/extracted", express.static("extracted"));
app.use(express.json());
app.use(cors());
app.use(bodyParser.text({ type: "text/plain" }));
app.use("/users", usersTag, UserRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/", (req, res) => {
  try {
    res.send("Server is working fine");
  } catch (error) {}
});

app.listen(5000, () => {
  console.log("Server started at port 5000");
});
