//
//  This is obsolete Code this is just here because I did it and I don't want to delete it
//      because I spent so many hours trying to get it to work
//
//          DO NOT CALL THIS SCRIPT IT WILL BREAK THE GALLERY
//
//  Sincerely Jacob
//      
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js';
import { getDatabase, get } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js';
import { getStorage, getDownloadURL, ref, listAll } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-storage.js';


// Your Firebase configuration
const firebaseConfigSecondary = {
    apiKey: "AIzaSyCJJatBLi5cR_GRhbsHQ5SdzlAW3bOswzU",
    authDomain: "inklinkweb.firebaseapp.com",
    projectId: "inklinkweb",
    storageBucket: "inklinkweb.appspot.com",
    messagingSenderId: "932046606000",
    appId: "1:932046606000:web:bae7db8b2929df69413575"
};


// Initialize Firebase
const secondaryApp = initializeApp(firebaseConfigSecondary, "secondary");
const db = getDatabase(secondaryApp);
const storage = getStorage(secondaryApp);


// Load all images from the 'scraped-images' folder and insert into gallery
async function loadImages() {
    const gallery = document.querySelector("div.gallery");
    

    const folderRef = ref(storage, "scraped-images");

    console.log("Loading images from Firebase Storage...");

    try {
        const result = await listAll(folderRef);
        console.log("Found items:", result.items);

        if (result.items.length === 0) {
            console.warn("No items found in 'scraped-images'");
        }

        for (const itemRef of result.items) {
            const url = await getDownloadURL(itemRef);
            console.log("Image URL:", url);

            const img = document.createElement("img");
            img.src = url;
            img.alt = "Tattoo image";
            img.className = "w-full h-auto rounded-lg shadow-md";

            gallery.appendChild(img);
        }
    } catch (error) {
        console.error("Error loading images:", error);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    loadImages();
});