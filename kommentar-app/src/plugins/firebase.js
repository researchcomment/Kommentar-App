// Import needed firebase modules
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyC4J2DXmw5DK04X_4DttM7VOpJEqNjr1Qo",
  authDomain: "commit-app-595af.firebaseapp.com",
  databaseURL: "https://commit-app-595af.firebaseio.com",
  projectId: "commit-app-595af",
  storageBucket: "commit-app-595af.appspot.com",
  messagingSenderId: "531526544381",
  appId: "1:531526544381:web:0212902c8e2c1a3a2dc794",
  measurementId: "G-PHX700JG9S"
};
  // Init our firebase app
firebase.initializeApp(firebaseConfig);
firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);



