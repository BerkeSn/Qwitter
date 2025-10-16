import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  
};

// let app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
// let db = getFirestore(app);

// export { db , analytics };

const firebaseApp = initializeApp(firebaseConfig);

// Firestore veritabanı servisini başlat
const db = getFirestore(firebaseApp);

// Diğer servisleri de burada başlatabilirsiniz
// const auth = getAuth(firebaseApp);

// Projenin diğer yerlerinden erişebilmek için export ediyoruz
export { db }