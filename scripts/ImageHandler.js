import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-storage.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getFirestore, collection, getDoc, setDoc, doc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

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
console.log('Firestore initialized:', db);

// Function to upload an image
export async function uploadImage(file, caption, style) {
    const user = auth.currentUser;
    if (!user) {
        alert("You must be logged in to upload images.");
        return;
    }
    const userId = user.uid;
    const timestamp = new Date().toISOString();
    const fileName = `${timestamp}_${file.name}`;
    const storageRef = ref(storage, `uploads/${userId}/${fileName}`);
    try {
        // Upload file to Firebase Storage
        const snapshot = await uploadBytes(storageRef, file);
        console.log("File uploaded:", snapshot);
        // Get download URL
        const downloadURL = await getDownloadURL(snapshot.ref);
        // Define a reference for the document in the images subcollection of the user document
        const imagesCollectionRef = collection(db, "default", userId, "images");
        // Use setDoc to create the image document
        await setDoc(doc(imagesCollectionRef, fileName), {
            caption: caption,
            style: style.toLowerCase(),
            imageUrl: downloadURL,
            timestamp: serverTimestamp()
        });
        console.log("Image metadata saved to Firestore with document ID:", fileName);
        alert("Image uploaded successfully!");
    } catch (error) {
        console.error("Upload error:", error.message);
        alert("Error uploading image: " + error.message);
    }
}