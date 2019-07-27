const functions = require("firebase-functions");
const express = require("express");
const app = express();
const { getAllScreams, saveScreams, getScream } = require("./handlers/screams");
const {
  signUp,
  login,
  uploadImage,
  addUserDetails,
  getUserDetails
} = require("./handlers/user");
const FBAuth = require("./util/fbAuth");

//scream routes
app.get("/screams", getAllScreams);
app.post("/scream", FBAuth, saveScreams);
app.get("/scream/:screamId", getScream);

//user routes
app.post("/signup", signUp);
app.post("/login", login);
app.post("/user/image", FBAuth, uploadImage);
app.post("/user", FBAuth, addUserDetails);
app.get("/user", FBAuth, getUserDetails);

exports.api = functions.https.onRequest(app);
