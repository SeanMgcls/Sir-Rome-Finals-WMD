const express = require("express");
const server = express();
const mongoose = require("mongoose");
//const port = 4000;
require("dotenv").config();


//middlewares
server.use(express.json());
server.use(express.urlencoded({extended:true}));
const userRoutes = require("./routes/User-Routes.js");
const courseRoutes = require("./routes/Course-Routes.js")


mongoose.connect(process.env.MONGODB_STRING);
mongoose.connection.once("open", ()=> console.log("Now connected to MONGODB Atlas"));

//back-end routes
server.use("/users", userRoutes);
server.use("/course", courseRoutes);

server.listen(process.env.PORT || 3000, () => console.log(`API is now connected on port ${process.env.PORT || 3000}`));
