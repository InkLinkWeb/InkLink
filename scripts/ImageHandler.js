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
    const validTypes = ['image/png', 'image/jpg', 'image/jpeg'];
    const maxSize = 5 * 1024 * 1024;
    if (!validTypes.includes(file.type)) {
        throw new Error('Invalid file type.');
    }
    if (file.size > maxSize) {
        throw new Error('File size exceeds 5MB.');
    }
    const userID = user.uid;
    const fileName = `${file.name}`;
    const storageRef = ref(storage, `uploads/${userID}/${fileName}`);
    try {
        // Upload file to Firebase Storage
        const snapshot = await uploadBytes(storageRef, file);
        console.log("File uploaded:", snapshot);
        const downloadURL = await getDownloadURL(snapshot.ref);
        // Save metadata in imagesIndex collection
        const imageDoc = {
            userID: userID,
            imageName: fileName,
            url: downloadURL,
            tags: [style.toLowerCase()],
            caption: caption,
            createdAt: serverTimestamp()
        };
        await setDoc(doc(db, "imagesIndex", fileName), imageDoc);
        console.log("Image metadata saved to imagesIndex.");
        alert("Image uploaded successfully!");
    } catch (error) {
        console.error("Upload error:", error.message);
        alert("Error uploading image: " + error.message);
    }
}

export async function handleFormSubmission(file, caption, style) {
    if (!file) throw new Error('Please select an image to upload.');
    if (!caption || caption.trim() === '') throw new Error('Please enter a caption.');
    if (caption.length > 200) throw new Error('Caption is too long. Please keep it under 200 characters.');
    if (!style || style.trim() === '') throw new Error('Please enter a tattoo style.');
    if (style.length > 50) throw new Error('Tattoo style is too long. Please keep it under 50 characters.');
    
    await uploadImage(file, caption.trim(), style.trim());
}


// // Function to fetch images from Firestore with pagination
// export async function fetchImages(selectedTag = null) {
//     console.log("Fetching images with tag:", selectedTag);
//     // Reference to Firestore collection
//     const imagesRef = collection(db, 'scrapedImages');
//     let q = query(imagesRef, orderBy('createdAt', 'desc'), limit(batchSize));

//     // If a selected tag exists, filter images by the tag
//     if (selectedTag) {
//         q = query(imagesRef, where("tags", "array-contains", selectedTag), orderBy('createdAt', 'desc'), limit(batchSize));
//     }
//     // Pagination logic
//     if (lastImageLoaded) {
//         q = query(q, startAfter(lastImageLoaded));
//     }
//     try {
//         // Fetch the images from Firestore based on the query
//         const snapshot = await getDocs(q);
//         if (!snapshot.empty) {
//             // Update the lastImageLoaded for pagination
//             lastImageLoaded = snapshot.docs[snapshot.docs.length - 1];
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
//                 $('#gallery').append(imageElement); // Append to gallery section
//             });
//             // Show the "Load More" button if there are more images to load
//             document.getElementById('load-more-btn').style.display = 'block';
//         } else {
//             console.log('No more images to load.');
//             // Hide the "Load More" button if no more images are available
//             document.getElementById('load-more-btn').style.display = 'none';
//         }
//     } catch (error) {
//         console.error("Error fetching images: ", error);
//     }
// }

export async function fetchImages(selectedTag = null) {
    console.log("Fetching images with tag:", selectedTag);
    const imagesRef = collection(db, 'imagesIndex');
    let q;
    // If a selected tag exists, filter images by the tag
    if (selectedTag) {
        q = query(
            imagesRef,
            where("tags", "==", selectedTag),
            orderBy('createdAt', 'desc'),
            limit(batchSize)
        );
    } else {
        q = query(
            imagesRef,
            orderBy('createdAt', 'desc'),
            limit(batchSize)
        );
    }
    // Pagination logic
    if (lastImageLoaded) {
        q = query(q, startAfter(lastImageLoaded));
    }
    try {
        // Fetch the images from Firestore based on the query
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
            lastImageLoaded = snapshot.docs[snapshot.docs.length - 1];
            snapshot.forEach(doc => {
                const data = doc.data();
                const imageUrl = data.url;
                const imageName = data.imageName;
                const caption = data.caption || '';  // Default to an empty string if no caption
                const imageTags = data.tags;
                // Generate HTML for each image
                const imageElement = `
                    <div class="gallery-item">
                        <img src="${imageUrl}" alt="${imageName}" class="w-full h-auto rounded-lg shadow-md padding-2 py-2"
                        data-caption="${caption}"
                        data-tag="${imageTags}">
                    </div>`;
                        // <p class="caption">${caption}</p>
                        // <p class="tags">${imageTags}</p>
                $('#gallery').append(imageElement); // Append to gallery section
            });
            document.getElementById('load-more-btn').style.display = 'block';
        } else {
            console.log('No more images to load.');
            document.getElementById('load-more-btn').style.display = 'none';
        }
    } catch (error) {
        console.error("Error fetching images: ", error);
    }
}

// // Function to fetch unique tags from Firestore and populate the dropdown
// export async function populateTagFilter() {
//     const tagsSet = new Set();
//     const imagesRef = collection(db, 'scrapedImages');
//     const q = query(imagesRef);
//     try {
//         const snapshot = await getDocs(q);
//         snapshot.forEach(doc => {
//             const data = doc.data();
//             if (Array.isArray(data.tags)) {
//                 data.tags.forEach(tag => tagsSet.add(tag));
//             }
//         });
//         const tagFilter = document.getElementById('tag-filter');
//         tagsSet.forEach(tag => {
//             const option = document.createElement('option');
//             option.value = tag;
//             option.textContent = tag;
//             tagFilter.appendChild(option);
//         });
//     } catch (error) {
//         console.error("Error fetching tags: ", error);
//     }
// }

// Function to fetch unique tags from imagesIndex and populate the dropdown
export async function populateTagFilter() {
    const tagsSet = new Set();
    const imagesRef = collection(db, 'imagesIndex');
    const q = query(imagesRef);
    try {
        const snapshot = await getDocs(q);
        snapshot.forEach(doc => {
            const data = doc.data();
            const tag = data.tags;
            if (tag) {
                // Convert tag to lowercase to normalize the casing
                const normalizedTag = tag.toLowerCase();
                tagsSet.add(normalizedTag);
            }
        });
        const tagFilter = document.getElementById('tag-filter');
        // Clear any existing options (except the first "All" option)
        tagFilter.length = 1;
        // Populate new unique tags
        tagsSet.forEach(tag => {
            const option = document.createElement('option');
            option.value = tag;
            // Capitalize the first letter of each tag for display purposes
            option.textContent = tag.charAt(0).toUpperCase() + tag.slice(1);
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
