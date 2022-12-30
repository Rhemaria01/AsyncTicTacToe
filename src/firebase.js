import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
    apiKey: "AIzaSyCTnqagCgEkCmq8hUiJm-0srq9kGadepPc",
    authDomain: "asycn-tictactoe.firebaseapp.com",
    projectId: "asycn-tictactoe",
    storageBucket: "asycn-tictactoe.appspot.com",
    messagingSenderId: "11255054321",
    appId: "1:11255054321:web:370678def0b1df59410e50"
  };
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
    export default db;

