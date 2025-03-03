import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-analytics.js";
// Firebase configuration
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyASqpQV1ZbAReT0uvdnD7FLlVYrq44h1Qc",
  authDomain: "inklink-37b44.firebaseapp.com",
  databaseURL: "https://inklink-37b44-default-rtdb.firebaseio.com",
  projectId: "inklink-37b44",
  storageBucket: "inklink-37b44.firebasestorage.app",
  messagingSenderId: "1045754527122",
  appId: "1:1045754527122:web:89eb567b86164f139a954b",
  measurementId: "G-VDK4YY132Z"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
const analytics = getAnalytics(app);
console.log("Firebase initialized:", app);
// Function to Sign Up
export async function signUp(email, password) {
    createUserWithEmailAndPassword(auth, email, password)
      .then(userCredential => {
        console.log("User signed up:", userCredential.user.uid);
      })
      .catch(error => {
        console.error("Signup error:", error.message);
      });
    }

// Function to Log In
export async function login(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log("User signed in:", user.uid);
        
        // Check if user is valid before redirecting
        if (user) {
            window.location.href = "/test.html";  // Redirect after successful login
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
            case 'auth/invalid-login-credentials':  // Handling this specific error code
                errorMessage = "Login failed: Invalid login credentials.";
                break;
            default:
                errorMessage = "Login failed: " + error.message;
        }

        console.error("Login error:", errorMessage);
        alert(errorMessage);  // Display appropriate error message to the user
    }
}

// Function to Log Out
export async function logout() {
    try {
        await signOut(auth);
        console.log("User logged out");
        window.location.href = "/index.html";  // Redirect after successful logout
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
      callback(user);
    });
  }