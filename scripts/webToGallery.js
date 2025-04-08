import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import fs from "fs";
import path from "path";


// Firebase configuration
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCJJatBLi5cR_GRhbsHQ5SdzlAW3bOswzU",
    authDomain: "inklinkweb.firebaseapp.com",
    projectId: "inklinkweb",
    storageBucket: "inklinkweb.firebasestorage.app",
    messagingSenderId: "932046606000",
    appId: "1:932046606000:web:bae7db8b2929df69413575"
  };

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const auth = getAuth(app);
const db = getFirestore(app);


async function uploadImage(filePath, imageName, metadata = {}) {
    // Read the file from disk
    const imageBuffer = fs.readFileSync(filePath);
  
    // Reference where to store in Firebase Storage
    const storageRef = ref(storage, `scraped-images/${imageName}`);
  
    // Upload to Firebase Storage
    const snapshot = await uploadBytes(storageRef, imageBuffer);
  
    // Get downloadable URL
    const downloadURL = await getDownloadURL(snapshot.ref);
  
    // Save metadata to Firestore
    await addDoc(collection(db, "scrapedImages"), {
      name: imageName,
      url: downloadURL,
      ...metadata,
      createdAt: new Date()
    });
  
    console.log(`Uploaded ${imageName} and saved metadata`);
  }
    // Change this to your image folder path
    const folderPath = "../webscrapping/testImage";

    fs.readdirSync(folderPath).forEach(async (file) => {
    const fullPath = path.join(folderPath, file);
    if (file.endsWith(".jpg") || file.endsWith(".png")) {
        await uploadImage(fullPath, file, { tags: ["tattoo"] });
    }
    });