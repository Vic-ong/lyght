import firebase from 'firebase/app';
import 'firebase/analytics';
import 'firebase/auth';
import 'firebase/storage';
import 'firebase/firestore';

import config from './config';

const firebaseApp = firebase.initializeApp(config);

firebase.analytics();

export default firebaseApp;
