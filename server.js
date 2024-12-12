const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const colors = require("colors");
const morgan = require("morgan");
const connectDB = require("./config/db");
const routes = require("./routes/routes.js");

//DOTENV
dotenv.config();
process.env.TZ = "Asia/Calcutta";
// MONGODB CONNECTION
connectDB();

//REST OBJECT
const app = express();

//middlewares
app.use(cors({
  origin: '*', // During development. Change this to your actual frontend URL in production
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());
app.use(morgan("dev"));

//ROUTES
app.use("/",routes);

//PORT
const PORT = process.env.PORT || 8080;
const now = Date.now();
//listen
app.listen(PORT, () => {
  console.log(`Server Runnning ${PORT}`.bgGreen.white);
  //console.log(new Date().toISOString());
  console.log({
    timestamp: now,
    readable: new Date(now).toLocaleString(),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
});
});