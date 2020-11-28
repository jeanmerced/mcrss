import * as firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyBurw8XY8S_1dh4Z_SW2szvOkp3DgHdGbs",
  authDomain: "white-smile-272204.firebaseapp.com",
  databaseURL: "https://white-smile-272204.firebaseio.com",
  projectId: "white-smile-272204",
  storageBucket: "white-smile-272204.appspot.com",
  messagingSenderId: "76189429173",
  appId: "1:76189429173:web:0091efee7fd0494bd5fdfc",
  measurementId: "G-898DKTX869"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export { firebase };
