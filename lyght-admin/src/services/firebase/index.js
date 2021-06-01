import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/storage';

import config from './config';

const firebaseApp = firebase.initializeApp(config);

export default firebaseApp;
