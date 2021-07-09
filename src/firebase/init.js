  import firebase from "firebase"
  import firestore from "firebase/firestore"
  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  var firebaseConfig = {
    apiKey: "AIzaSyCoepB_sM1CUXWoc2drJ6kxmg6Bu4Y-iF4",
    authDomain: "optimal-itinerary-planner-2.firebaseapp.com",
    projectId: "optimal-itinerary-planner-2",
    storageBucket: "optimal-itinerary-planner-2.appspot.com",
    messagingSenderId: "383452786146",
    appId: "1:383452786146:web:e9d2fb44a651827b999dbb",
    measurementId: "G-HSSKG1B7KT"
  };
  // Initialize Firebase
  const firebaseApp = firebase.initializeApp(firebaseConfig);
  firebase.analytics();

  export default firebaseApp.firestore();