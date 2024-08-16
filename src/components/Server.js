// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database"; // Import the Realtime Database function
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAVv4TSNJcwdxsxADEDxcQbZuDPnTY49Ms",
  authDomain: "ifi-attendance.firebaseapp.com",
  databaseURL: "https://ifi-attendance-default-rtdb.firebaseio.com/",
  projectId: "ifi-attendance",
  storageBucket: "ifi-attendance.appspot.com",
  messagingSenderId: "851583311048",
  appId: "1:851583311048:web:bc892d4139c91dfaf2d9fd",
  // measurementId: "G-L8JN0QK7MS",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app); // Initialize Realtime Database
const analytics = getAnalytics(app);

export default database;
