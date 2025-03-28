// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-storage.js";
// Your Firebase configuration object
const firebaseConfig = {
    apiKey: "AIzaSyCJJatBLi5cR_GRhbsHQ5SdzlAW3bOswzU",
    authDomain: "inklinkweb.firebaseapp.com",
    projectId: "inklinkweb",
    storageBucket: "inklinkweb.firebasestorage.app",
    messagingSenderId: "932046606000",
    appId: "1:932046606000:web:bae7db8b2929df69413575"
  };

  const app = initializeApp(firebaseConfig);
  
  // Initialize Firebase Authentication and get a reference to the service
  const auth = getAuth(app);
  
  // Initialize Cloud Storage and get a reference to the service
  const storage = getStorage(app);
  console.log("Storage initialized:", storage);
  
  export async function UploadImage(file) {
    // Check if a user is signed in
    const user = auth.currentUser;
    if (!user) {
      console.error('User must be signed in to upload images.');
      return;
    }
  
    // Proceed with the upload
    const userID = user.uid;
    const storageRef = ref(storage, `images/${userID}/${file.name}`);
  
    try {
      // Upload the file
      const snapshot = await uploadBytes(storageRef, file);
      console.log('Uploaded an image', snapshot);
  
      // Get the download URL
      const downloadURL = await getDownloadURL(snapshot.ref);
      console.log('File available at', downloadURL);
      return downloadURL; // You can use this URL to display the image or save it to your database
    } catch (error) {
      console.error('Upload failed', error);
    }
  }

  