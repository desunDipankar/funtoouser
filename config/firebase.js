import * as firebase from "firebase";
import "@firebase/auth";
// 'use-strict';

// const firebase = require('firebase');
// const APP_BASE = 'https://your-unique-url.firebaseapp.com/'


const firebaseConfig = {
	apiKey: "AIzaSyAVb5cgLt-U6UzEVhSHYS-hq_Esp--FkSk",
	authDomain: "funtoo-5f034.firebaseapp.com",
	projectId: "funtoo-5f034",
	storageBucket: "funtoo-5f034.appspot.com",
	messagingSenderId: "96297155563",
	appId: "1:96297155563:web:818e420f370ccbe46337ae",
	measurementId: "G-JG2QK0VY3P"
};

// Initialize Firebase
if (!firebase.apps.length) {
	firebase.initializeApp(firebaseConfig);
} else {
	firebase.app();
}

export default firebase;