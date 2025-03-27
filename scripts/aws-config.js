import Amplify from 'aws-amplify';

Amplify.configure({
    Auth: {
        region: 'us-east-2',
        userPoolId: 'us-east-2_GlVZMSSZA',
        userPoolWebClientId: '3bnjbp5mveaic2kn3nqjcndnf3',
        mandatorySignIn: false,
        authenticationFlowType: 'USER_SRP_AUTH',
        oauth: {
            domain: 'https://cognito-idp.us-east-2.amazonaws.com/us-east-2_GlVZMSSZA',
            scope: ['openid', 'profile', 'email'],
            redirectSignIn: 'https://InkLinkWeb.github.io/InkLink/gallery.html', // The URL where users will be redirected after login
            redirectSignOut: 'https://InkLinkWeb.github.io/InkLink/gallery.html', // The URL to redirect to after logout
            responseType: 'code'
        },
    }
});