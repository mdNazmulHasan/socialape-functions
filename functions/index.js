const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const firebase = require("firebase");
const app = express();
admin.initializeApp();
const firebaseConfig = {
  apiKey: "AIzaSyBTwihrwXcfIxuZA-JIFpwDQmRevLEMb_0",
  authDomain: "kinetic-dream-106907.firebaseapp.com",
  databaseURL: "https://kinetic-dream-106907.firebaseio.com",
  projectId: "kinetic-dream-106907",
  storageBucket: "kinetic-dream-106907.appspot.com",
  messagingSenderId: "925749541564",
  appId: "1:925749541564:web:c848e2c3703243d9"
};
firebase.initializeApp(firebaseConfig);

app.get("/screams", (req, res) => {
  admin.firestore()
    .collection("screams")
    .orderBy("createdAt", "desc")
    .get()
    .then(data => {
      let screams = [];
      data.forEach(doc => {
        screams.push({
          screamId: doc.id,
          ...doc.data()
        });
      });
      return res.json(screams);
    })
    .catch(err => {
      console.error(err);
    });
});

app.post("/scream", (req, res) => {
  const newScreams = {
    body: req.body.body,
    userHandle: req.body.userHandle,
    createdAt: new Date().toISOString()
  };
  admin.firestore()
    .collection("screams")
    .add(newScreams)
    .then(doc => {
      res.json(`document ${doc.id} created successfully`);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: "something went wrong" });
    });
});
app.post("/signup", (req, res) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    handle: req.body.handle
  };
  firebase
    .auth()
    .createUserWithEmailAndPassword(newUser.email, newUser.password)
    .then(result => {
      return res
        .status(201)
        .json({ message: `user ${result.user.uid} created` });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: "something went wrong" });
    });
});

exports.api = functions.https.onRequest(app);
