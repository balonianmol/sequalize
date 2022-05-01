const express = require("express");
const app = express();
app.use(express.json());
const db = require("./db/network")
const session = require("express-session");
const passport = require("passport")
app.use(session({ secret: 'super secret' }));
const strategy = require('./middleware/password-auth')
const multer = require("multer");
app.use(passport.initialize());
app.use(passport.session());
const router = require('./router/userroutes')
app.use("/", router)
app.listen(8080, () => {
  console.log("server started at 8080");
});