

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

import { getVertexAI, getGenerativeModel } from "firebase/vertexai-preview";
// Your Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};

// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);

// Initialize Vertex AI
const vertexAI = getVertexAI(firebaseApp);
const model = getGenerativeModel(vertexAI, { model: "gemini-1.5-flash" });
const db = firebase.firestore();
const auth = firebase.auth();

// Export the initialized instances
export { model, db, auth, firebaseApp };
