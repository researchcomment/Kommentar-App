const firebaseConfig = {
    apiKey: "AIzaSyDlpWRm-Don3j-vzg8Ibj6fSSUsKD7Kq0k",
    authDomain: "presentation-892e1.firebaseapp.com",
    databaseURL: "https://presentation-892e1.firebaseio.com",
    projectId: "presentation-892e1",
    storageBucket: "presentation-892e1.appspot.com",
    messagingSenderId: "640487951310",
    appId: "1:640487951310:web:1ebbf2f30f93c60567799f",
    measurementId: "G-K2T8291LVW"
};
firebase.initializeApp(firebaseConfig);
var database = firebase.database();
var dbref = database.ref().child("kommentar");

function push_komm(content) {
    dbref.once('value').then(function(snap) {
        console.log(snap.val());
    })
}