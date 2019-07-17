const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const firebase = require("firebase");
const app = express();
admin.initializeApp();
const db = admin.firestore();

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
  db.collection("screams")
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
  db.collection("screams")
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
  db.doc(`/users/${newUser.handle}`)
    .get()
    .then(doc => {
      if (doc.exists) {
        res.status(400).json({ handle: "handle already taken" });
      } else {
        firebase
          .auth()
          .createUserWithEmailAndPassword(newUser.email, newUser.password)
          .then(data => {
            return data.user.getIdToken;
          })
          .then(token => {
            return res.status(201).json({ token });
          })
          .catch(err => {
            console.error(err);
            if (err.code === "auth/email-already-in-use") {
              return res.status(400).json({ email: "email already in use" });
            } else {
              return res.status(500).json({ error: err.code });
            }
          });
      }
    });
});

exports.api = functions.https.onRequest(app);
