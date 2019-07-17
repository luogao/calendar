import * as firebase from 'firebase/app'

import 'firebase/auth'
import 'firebase/database'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyDt4nt2i8Pnu_AIB00zvhIHBKStiNYBcwE',
  authDomain: 'calendar-lg.firebaseapp.com',
  databaseURL: 'https://calendar-lg.firebaseio.com',
  projectId: 'calendar-lg',
  storageBucket: '',
  messagingSenderId: '120685637335',
  appId: '1:120685637335:web:b819bfbce6424745'
}
// Initialize Firebase
firebase.initializeApp(firebaseConfig)

const db = firebase.database()

export default db
