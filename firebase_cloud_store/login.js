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
var firestore = firebase.firestore();
const docRef = firestore.doc("samples/firstDoc");

const header = document.getElementById("header");
const username = document.getElementById("username");
const passowrd = document.getElementById("password");
const submit = document.getElementById("submit");
console.log("执行到监听器前面");
submit.addEventListener("click", function() {
    console.log("执行监听器");
    const name = username.value;
    docRef.set({
        htStatus: name
    }).then(function() {
        console.log("success");
    }).catch(function(error) {
        console.log("failed!");
    })
});