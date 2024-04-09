const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "MadBracket API",
    description: "API Documentation",
  },
  host: "madbracket.xyz",
  schemes: ["http", "https"],
};

const outputFile = "./swagger.json";
const endpointsFiles = ["./index.ts"];

swaggerAutogen(outputFile, endpointsFiles, doc);
