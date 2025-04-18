import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-storage.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getFirestore, collection, where, query, orderBy, startAfter, limit, setDoc, doc, getDocs, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

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
const db = getFirestore(app, 'gallerydata');
console.log('Firestore initialized:', db);

let batchSize = 10;
export let lastImageLoaded = null;

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
        const imagesCollectionRef = collection(db, "users", userId, "images");
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


// Function to fetch images from Firestore with pagination
export async function fetchImages(selectedTag = null) {
    console.log("Fetching images with tag:", selectedTag);
    // Reference to Firestore collection
    const imagesRef = collection(db, 'scrapedImages');
    let q = query(imagesRef, orderBy('createdAt', 'desc'), limit(batchSize));

    // If a selected tag exists, filter images by the tag
    if (selectedTag) {
        q = query(imagesRef, where("tags", "array-contains", selectedTag), orderBy('createdAt', 'desc'), limit(batchSize));
    }
    // Include pagination logic if lastImageLoaded exists
    if (lastImageLoaded) {
        q = query(q, startAfter(lastImageLoaded));
    }
    try {
        // Fetch the images from Firestore based on the query
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
            // Update the lastImageLoaded for pagination
            lastImageLoaded = snapshot.docs[snapshot.docs.length - 1];
            // Loop through the snapshot and append the images to the gallery
            snapshot.forEach(doc => {
                const data = doc.data();
                const imageUrl = data.url;
                const imageName = data.name;
                const imageTags = data.tags.join(', ');
                // Generate HTML for each image
                // We probably shouldn't be displaying the tags under each image
                // It is good for testing but we should change before demo
                // <p class="tags">${imageTags}</p>
                const imageElement = `
                    <div class="gallery-item">
                        <img src="${imageUrl}" alt="${imageName}" class="w-full mb-4 rounded-lg">
                    </div>`;
                $('#gallery').append(imageElement); // Append to gallery section
            });
            // Show the "Load More" button if there are more images to load
            document.getElementById('load-more-btn').style.display = 'block';
        } else {
            console.log('No more images to load.');
            // Hide the "Load More" button if no more images are available
            document.getElementById('load-more-btn').style.display = 'none';
        }
    } catch (error) {
        console.error("Error fetching images: ", error);
    }
}


// Function to fetch unique tags from Firestore and populate the dropdown
export async function populateTagFilter() {
    const tagsSet = new Set();
    const imagesRef = collection(db, 'scrapedImages');
    const q = query(imagesRef);
    try {
        const snapshot = await getDocs(q);
        snapshot.forEach(doc => {
            const data = doc.data();
            if (Array.isArray(data.tags)) {
                data.tags.forEach(tag => tagsSet.add(tag));
            }
        });
        const tagFilter = document.getElementById('tag-filter');
        tagsSet.forEach(tag => {
            const option = document.createElement('option');
            option.value = tag;
            option.textContent = tag;
            tagFilter.appendChild(option);
        });
    } catch (error) {
        console.error("Error fetching tags: ", error);
    }
}


// Function to handle tag filter change
export async function filterImagesByTag(event) {
    const selectedTag = event.target.value;
    const scrollPosition = window.scrollY;
    // Clear the current gallery
    $('#gallery').empty();
    lastImageLoaded = null; // Reset pagination when a new tag is selected
    // Hide the "Load More" button when filtering by a tag
    document.getElementById('load-more-btn').style.display = 'none';
    // Fetch images with the selected tag
    await fetchImages(selectedTag);
    // Restore the scroll position
    window.scrollTo(0, scrollPosition);
}
