// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB3giGXUMCjHRk0XEILfrER2C1Y0CW4f7g",
  authDomain: "crud-generator-1d538.firebaseapp.com",
  projectId: "crud-generator-1d538",
  storageBucket: "crud-generator-1d538.appspot.com",
  messagingSenderId: "488917621676",
  appId: "1:488917621676:web:f2033cb973d031fdcdb809"
};

// Initialize Firebase
const firebaseConf = initializeApp(firebaseConfig);

export default firebaseConf;
// Now you can use Firebase services in your React app!