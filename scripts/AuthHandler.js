import Auth from 'aws-amplify';

console.log("AuthHandler.js loaded");

export default class AuthHandler {
    // Sign-up function to register a new user
    static async signUp(username, password, email) {
        try {
            // Sign up the user with Amplify
            const { user } = await Auth.signUp({
                username, // The user's username
                password, // The user's password
                attributes: {
                    email, // The user's email
                }
            });

            console.log("Sign-up successful:", user);

            // Automatically sign the user in after sign-up (optional, but useful for seamless experience)
            await Auth.signIn(username, password);

            // Redirect to the gallery page after sign-up and login
            window.location.href = 'gallery.html';

        } catch (error) {
            console.error("Error during sign-up:", error);
        }
    }

    // Sign-in function
    static async signIn() {
        try {
            // Start the sign-in process using Amplify's Auth (this will redirect the user)
            await Auth.federatedSignIn();

            // After successful sign-in, redirect to the gallery page
            window.location.href = 'gallery.html';
        } catch (error) {
            console.error("Error signing in: ", error);
        }
    }

    // Sign-out function
    static async signOut() {
        try {
            // Sign out the user using Amplify
            await Auth.signOut();

            // After sign-out, redirect to the gallery page
            window.location.href = 'gallery.html';
        } catch (error) {
            console.error("Error signing out: ", error);
        }
    }

    // Check if the user is authenticated (useful for verifying auth state)
    static async checkAuth() {
        try {
            // Check if the user is authenticated
            const user = await Auth.currentAuthenticatedUser();
            return user ? true : false;
        } catch (error) {
            return false; // User is not authenticated
        }
    }
}
