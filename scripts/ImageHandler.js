import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-storage.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getFirestore, collection, query, orderBy, startAfter, limit, setDoc, doc, getDocs, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

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

// Pagination variables
const batchSize = 10; // Number of images per batch
let lastVisible = null; // Reference to the last document fetched
let loading = false; // To prevent multiple simultaneous fetches

// // Function to upload an image
// export async function uploadImage(file, caption, style) {
//     const user = auth.currentUser;
//     if (!user) {
//         alert("You must be logged in to upload images.");
//         return;
//     }
//     const userId = user.uid;
//     const timestamp = new Date().toISOString();
//     const fileName = `${timestamp}_${file.name}`;
//     const storageRef = ref(storage, `uploads/${userId}/${fileName}`);
//     try {
//         // Upload file to Firebase Storage
//         const snapshot = await uploadBytes(storageRef, file);
//         console.log("File uploaded:", snapshot);
//         // Get download URL
//         const downloadURL = await getDownloadURL(snapshot.ref);
//         // Define a reference for the document in the images subcollection of the user document
//         const imagesCollectionRef = collection(db, "users", userId, "images");
//         // Use setDoc to create the image document
//         await setDoc(doc(imagesCollectionRef, fileName), {
//             caption: caption,
//             style: style.toLowerCase(),
//             imageUrl: downloadURL,
//             timestamp: serverTimestamp()
//         });
//         console.log("Image metadata saved to Firestore with document ID:", fileName);
//         alert("Image uploaded successfully!");
//     } catch (error) {
//         console.error("Upload error:", error.message);
//         alert("Error uploading image: " + error.message);
//     }
// }

// // Function to fetch images from Firestore
// export async function fetchImages(selectedTag = null) {
//     console.log("Fetching images with tag:", selectedTag);
//     if (loading) return;
//     loading = true;

//     // Reference to Firestore collection
//     const imagesRef = collection(db, 'scrapedImages');
//     let q = query(imagesRef, orderBy('createdAt', 'desc'), limit(batchSize));

//     // If a selected tag exists, filter images by the tag
//     if (selectedTag) {
//         q = query(imagesRef, where("tags", "array-contains", selectedTag), orderBy('createdAt', 'desc'), limit(batchSize));
//     }
//     // Include pagination logic if lastVisible exists
//     if (lastVisible) {
//         q = query(q, startAfter(lastVisible));
//     }
//     try {
//         // Fetch the images from Firestore based on the query
//         const snapshot = await getDocs(q);
//         if (!snapshot.empty) {
//             lastVisible = snapshot.docs[snapshot.docs.length - 1];  // Set the last visible document for pagination
//             // Loop through the snapshot and append the images to the gallery
//             snapshot.forEach(doc => {
//                 const data = doc.data();
//                 const imageUrl = data.url;
//                 const imageName = data.name;
//                 const imageTags = data.tags.join(', ');
//                 // Generate HTML for each image
//                 const imageElement = `
//                     <div class="gallery-item">
//                         <img src="${imageUrl}" alt="${imageName}" class="w-full h-auto rounded-lg shadow-md">
//                         <p class="tags">${imageTags}</p>
//                     </div>`;
//                 $('#gallery').append(imageElement);  // Append to gallery section
//             });
//         } else {
//             console.log('No more images to load.');
//         }
//     } catch (error) {
//         console.error("Error fetching images: ", error);
//     } finally {
//         loading = false;
//     }
// }

// Function to fetch images with pagination
export async function fetchImages(selectedTag = '') {
    let q = query(collection(db, "images"), orderBy("timestamp"), limit(6));

    // Apply tag filter if selected
    if (selectedTag) {
        q = query(q, where("tags", "array-contains", selectedTag));
    }

    // Include pagination if there's a last loaded image
    if (lastImageLoaded) {
        q = query(q, startAfter(lastImageLoaded));
    }

    try {
        const snapshot = await getDocs(q);
        const gallery = document.getElementById('gallery');

        snapshot.forEach(doc => {
            const data = doc.data();
            const imageUrl = data.url;
            const imageName = data.name;
            const imageTags = data.tags.join(', ');
            const imageElement = `
                <div class="gallery-item">
                    <img src="${imageUrl}" alt="${imageName}" class="w-full h-auto rounded-lg shadow-md">
                    <p class="tags">${imageTags}</p>
                </div>`;
            gallery.insertAdjacentHTML('beforeend', imageElement);
        });

        // Update the lastImageLoaded for pagination
        if (!snapshot.empty) {
            lastImageLoaded = snapshot.docs[snapshot.docs.length - 1];
        }

        // Hide the "Load More" button if there are no more images
        if (snapshot.empty) {
            document.getElementById('load-more-btn').style.display = 'none';
        }
    } catch (error) {
        console.error('Error fetching images:', error);
    }
}

// Function to fetch unique tags from Firestore and populate the dropdown
export async function populateTagFilter() {
    const tagsSet = new Set();
    const imagesRef = collection(db, 'scrapedimages');
    const q = query(imagesRef);
    const snapshot = await getDocs(q);

    snapshot.forEach(doc => {
        const data = doc.data();
        data.tags.forEach(tag => tagsSet.add(tag));
    });

    const tagFilter = document.getElementById('tag-filter');
    tagsSet.forEach(tag => {
        const option = document.createElement('option');
        option.value = tag;
        option.textContent = tag;
        tagFilter.appendChild(option);
    });
}

// Function to handle tag filter change
export async function filterImagesByTag(event) {
    const selectedTag = event.target.value;
    // Clear the current gallery
    $('#gallery').empty();
    // Fetch images with the selected tag
    fetchImages(selectedTag);
}