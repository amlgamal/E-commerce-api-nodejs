const path = require('path')

const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");

//what is this line do ?
//may it becuse it is not .env علطول
dotenv.config({ path: "config.env" });
const ApiError = require("./utils/apiError");
const globalError = require("./middlewares/errorMiddleware");
const dbConnection = require("./config/database");

//routes
const categoryRoute = require("./routes/categoryRoute");
const subCategoryRoute = require("./routes/subCategoryRoutes");
const brandRoute = require("./routes/brandRoute");
const productRoute = require("./routes/productRoute");
const userRoute = require("./routes/userRoute");
const authRoute = require("./routes/authRoute");

//conect with DB
dbConnection();

//conect with express
const app = express();

//middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname, 'uploads')))


if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode : ${process.env.NODE_ENV}`);
}

// Mount route
app.use("/api/v1/categories", categoryRoute);
app.use("/api/v1/subcategories", subCategoryRoute);
app.use("/api/v1/brand", brandRoute);
app.use("/api/v1/products", productRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/auth", authRoute)

// what is deffrence
app.all("*", (req, res, next) => {
  next(new ApiError(`can't find this route :${req.originalUrl} `, 400));
});

//Global error handling middleware ==> for express
app.use(globalError);

//
const port = process.env.port || 8000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

//Handling Rejection  ==> outside express
process.on("unhandledRejection", (err) => {
  console.log(`unhandledRejection Errors :${err.name} | ${err.message}`);
  server.close(() => {
    console.log(`shutting down..`);
    process.exit(1);
  });
});
