import { Amplify } from 'aws-amplify';

Amplify.configure({
    Auth: {
        region: 'us-east-2', // Change this to your AWS region
        userPoolId: 'us-east-2_36qauXtpc',
        userPoolWebClientId: '3bnjbp5mveaic2kn3nqjcndnf3',
        mandatorySignIn: false
    }
});