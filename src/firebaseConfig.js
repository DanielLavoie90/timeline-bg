import firebase from 'firebase'
import 'firebase/database'

// firebase init goes here
const config = {
  apiKey: "AIzaSyARS2z3Czt7KAJ1g_AaAB2ehc6p9aURKeQ",
  authDomain: "timeline-bg.firebaseapp.com",
  databaseURL: "https://timeline-bg.firebaseio.com",
  projectId: "timeline-bg",
  storageBucket: "timeline-bg.appspot.com",
  messagingSenderId: "229524016444",
  appId: "1:229524016444:web:e217a2bdcb96218eaa6239"
}
firebase.initializeApp(config)

// firebase utils
const db = firebase.database()

export default db