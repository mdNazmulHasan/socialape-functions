const functions = require("firebase-functions");
const express = require("express");
const app = express();
const { getAllScreams, saveScreams } = require("./handlers/screams");
const {
  signUp,
  login,
  uploadImage,
  addUserDetails
} = require("./handlers/user");
const FBAuth = require("./util/fbAuth");

//scream routes
app.get("/screams", getAllScreams);
app.post("/scream", FBAuth, saveScreams);

//user routes
app.post("/signup", signUp);
app.post("/login", login);
app.post("/user/image", FBAuth, uploadImage);
app.post("/user", FBAuth, addUserDetails);

exports.api = functions.https.onRequest(app);
