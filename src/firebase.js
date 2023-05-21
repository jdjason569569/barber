import {initializeApp} from 'firebase/app';
import {getAuth} from 'firebase/auth';
import {getStorage} from 'firebase/storage';

import 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyD_99FiiwECgiJ3hk-6ePpcYCWyBpZkI-4",
    authDomain: "barber-2daf5.firebaseapp.com",
    projectId: "barber-2daf5",
    storageBucket: "barber-2daf5.appspot.com",
    messagingSenderId: "506125495953",
    appId: "1:506125495953:web:f75b7dfa837f2483bed930",
    measurementId: "G-6252DWTDTW"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const storage = getStorage(app);

export {app, auth, storage};
