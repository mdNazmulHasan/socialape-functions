const functions = require("firebase-functions");
const express = require("express");
const app = express();
const {
  getAllScreams,
  saveScreams,
  getScream,
  commentOnScream,
  likeScream,
  unlikeScream,
  deleteScream
} = require("./handlers/screams");
const { signUp, login, uploadImage, addUserDetails, getUserDetails } = require("./handlers/user");
const FBAuth = require("./util/fbAuth");
const { db } = require("./util/admin");

//scream routes
app.get("/screams", getAllScreams);
app.post("/scream", FBAuth, saveScreams);
app.get("/scream/:screamId", getScream);
app.post("/scream/:screamId/comment", FBAuth, commentOnScream);
app.get("/screams/:screamId/like", FBAuth, likeScream);
app.get("/screams/:screamId/unlike", FBAuth, unlikeScream);
app.delete("/scream/:screamId", FBAuth, deleteScream);

//user routes
app.post("/signup", signUp);
app.post("/login", login);
app.post("/user/image", FBAuth, uploadImage);
app.post("/user", FBAuth, addUserDetails);
app.get("/user", FBAuth, getUserDetails);

exports.api = functions.https.onRequest(app);

exports.createNotificationOnLike = functions.firestore.document("likes/{id}").onCreate(snapshot => {
  db.doc(`/screams/${snapshot.data().screamId}`)
    .get()
    .then(doc => {
      if (doc.exists) {
        return db
          .doc(`/notifications/${snapshot.id}`)
          .set({
            createdAt: new Date().toISOString(),
            recipient: doc.data().userHandle,
            sender: snapshot.data().userHandle,
            type: "like",
            read: false,
            screamId: doc.id
          })
          .then(() => {
            return;
          })
          .catch(err => {
            console.error(err);
            return;
          });
      }
    });
});
exports.createNotificationOnComments = functions.firestore
  .document("comments/{id}")
  .onCreate(snapshot => {
    db.doc(`/screams/${snapshot.data().screamId}`)
      .get()
      .then(doc => {
        if (doc.exists) {
          return db
            .doc(`/notifications/${snapshot.id}`)
            .set({
              createdAt: new Date().toISOString(),
              recipient: doc.data().userHandle,
              sender: snapshot.data().userHandle,
              type: "like",
              read: false,
              screamId: doc.id
            })
            .then(() => {
              return;
            })
            .catch(err => {
              console.error(err);
              return;
            });
        }
      });
  });
