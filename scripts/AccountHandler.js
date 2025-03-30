import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

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
const auth = getAuth(app);
const db = getFirestore(app);
console.log("Firebase initialized:", app);
  
// Function to Sign Up
export async function signUp(email, password) {
    try {
      // Create the user account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("User signed up:", user.uid);

      // Wait until user is fully created in Firebase Auth
      if (!user || !user.uid) {
        throw new Error("User creation failed or UID is missing");
      }
  
      const userRef = doc(db, "users", user.uid);
      console.log("Attempting to create document at:", userRef);
  
      // Create user document in Firestore with default data
      await setDoc(userRef, {
        displayName: "Default Name",
        bio: "This is a bio.",
        profilePictureURL: ""
      });
  
      console.log("Profile document created for user:", user.uid);
    } catch (error) {
      console.error("Signup error:", error.message);
      alert("Signup error: " + error.message);
    }
}


// Function to Log In
export async function login(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log("User signed in:", user.uid);
        // Check if user is valid before redirecting
        if (user) {
            window.location.href = "/InkLink/gallery.html";
        } else {
            console.error("Login failed: User is undefined");
            alert("Login failed: User is undefined");
        }
    } catch (error) {
        // Handle different Firebase auth errors
        let errorMessage;

        switch (error.code) {
            case 'auth/invalid-email':
                errorMessage = "Login failed: Invalid email address.";
                break;
            case 'auth/user-disabled':
                errorMessage = "Login failed: User account is disabled.";
                break;
            case 'auth/user-not-found':
                errorMessage = "Login failed: No user found with this email address.";
                break;
            case 'auth/wrong-password':
                errorMessage = "Login failed: Incorrect password.";
                break;
            case 'auth/invalid-login-credentials':
                errorMessage = "Login failed: Invalid login credentials.";
                break;
            default:
                errorMessage = "Login failed: " + error.message;
        }

        console.error("Login error:", errorMessage);
        alert(errorMessage);
    }
}

// Function to Log Out
export async function logout() {
    try {
        await signOut(auth);
        console.log("User logged out");
        window.location.href = "/InkLink/index.html";  // Redirect after successful logout
    } catch (error) {
        // Handle case when no user is signed in
        if (error.code === 'auth/no-current-user') {
            console.log("No user is currently signed in.");
            alert("You are not logged in.");
        } else {
            console.error("Logout error:", error.message);
            alert("Logout failed: " + error.message);
        }
    }
}

// Function to Check if User is Logged In
export async function checkAuth(callback) {
    onAuthStateChanged(auth, user => {
      if (user) {
          console.log("User is signed in:", user.uid);
          callback(user);
      } else {
          console.log("No user is signed in.");
          callback(null);
      }
    });
}

