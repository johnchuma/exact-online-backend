const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "Exact Online API Docs",
    description: "These are API's for Exact Online system",
  },
  host: "localhost:5000",
  schemes: ["http"],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
      },
    },
  },
};

const outputFile = "./swagger-output.json";
const routes = ["./index.js"]; // Entry point for all routes

// Generate the Swagger docs
swaggerAutogen(outputFile, routes, doc).then(() => {
  console.log("Swagger docs generated!");
});
