import firebase from "firebase/app";

// Import needed firebase modules
import "firebase/auth";
import "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyDcUx9OMbnAyBsYBR1lyokRqoSLSUysdVw",
    authDomain: "vue-firebase-app-2a823.firebaseapp.com",
    databaseURL: "https://vue-firebase-app-2a823.firebaseio.com",
    projectId: "vue-firebase-app-2a823",
    storageBucket: "vue-firebase-app-2a823.appspot.com",
    messagingSenderId: "678170039843",
    appId: "1:678170039843:web:560bd4ce416ddc1a6f0396"
  };

  // Init our firebase app
firebase.initializeApp(firebaseConfig);