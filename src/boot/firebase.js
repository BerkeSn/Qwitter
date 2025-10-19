import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyC_gXUlPL9N11_nnDYkFt0XQfil0HYlxTk",
  authDomain: "qweets-7284d.firebaseapp.com",
  projectId: "qweets-7284d",
  storageBucket: "qweets-7284d.firebasestorage.app",
  messagingSenderId: "545701880551",
  appId: "1:545701880551:web:8389e6f2c6b56acb92f842"
};

// let app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
// let db = getFirestore(app);

// export { db , analytics };

const firebaseApp = initializeApp(firebaseConfig);

// Firestore veritabanı servisini başlat
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

// Diğer servisleri de burada başlatabilirsiniz
// const auth = getAuth(firebaseApp);

// Projenin diğer yerlerinden erişebilmek için export ediyoruz
export { auth, db }