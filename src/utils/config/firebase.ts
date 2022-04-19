import firebase from "firebase/compat/app";
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCGBBoio2CocbIDZk1os2S-nn4aI_xjymw",
    authDomain: "letsg0-3aa21.firebaseapp.com",
    projectId: "letsg0-3aa21",
    storageBucket: "letsg0-3aa21.appspot.com",
    messagingSenderId: "656749191265",
    appId: "1:656749191265:web:ba511e7c543e12f787ca20",
    measurementId: "G-B0Z7BJRKK1"
};


firebase.initializeApp(firebaseConfig);

export default firebase
