import Firebase from "firebase";

var config = {
    apiKey: "AIzaSyCEckzvLB4kUPTIwX8ApOC2MH7Uu6_2Cns",
    authDomain: "travelagency-32090.firebaseapp.com",
    databaseURL: "https://travelagency-32090.firebaseio.com",
    projectId: "travelagency-32090",
    storageBucket: "travelagency-32090.appspot.com",
    messagingSenderId: "883175737847"
};
export const firebaseRef = Firebase.initializeApp(config);