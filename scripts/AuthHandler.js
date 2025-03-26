// Sign Up Function
function signUp() {
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const userType = document.getElementById('userType').value; // Custom attribute for account type

    // Calling Amplify Auth to sign up a new user
    Amplify.Auth.signUp({
        username: email,
        password: password,
        attributes: {
            email: email,
            userType: userType // Adding custom attribute
        }
    })
    .then(data => {
        console.log('Sign up successful:', data);

        // Now automatically sign the user in
        Amplify.Auth.signIn(email, password)
            .then(user => {
                console.log('Sign in successful:', user);

                // Redirect to gallery.html after successful sign-in
                window.location.href = 'gallery.html'; // Redirect to gallery page
            })
            .catch(err => {
                console.log('Error signing in after sign up:', err);
                alert('Error signing in after sign-up: ' + err.message);
            });
    })
    .catch(err => {
        console.log('Error signing up:', err);
        alert('Error signing up: ' + err.message);
    });
}


// Sign In Function
function signIn() {
    const email = document.getElementById('signinEmail').value;
    const password = document.getElementById('signinPassword').value;

    Amplify.Auth.signIn(email, password)
    .then(user => {
        console.log('Sign in successful:', user);
        alert('Sign in successful!');
        window.location.href = 'gallery.html';
    })
    .catch(err => {
        console.log('Error signing in:', err);
        alert('Error signing in: ' + err.message);
    });
}


// Sign Out Function
function signOut() {
    Amplify.Auth.signOut()
    .then(data => {
        console.log('Sign out successful:', data);
        alert('Sign out successful!');
        // Handle post-sign-out flow here (redirect to homepage, etc.)
    })
    .catch(err => {
        console.log('Error signing out:', err);
        alert('Error signing out: ' + err.message);
    });
}


// Check Account Session Function
function checkUserSession() {
    Amplify.Auth.currentSession()
    .then(session => {
        console.log('User is signed in:', session);
        // Proceed with signed-in user flow (showing the dashboard, etc.)
    })
    .catch(err => {
        console.log('No user signed in:', err);
        // Proceed with sign-in/signup flow
    });
}
