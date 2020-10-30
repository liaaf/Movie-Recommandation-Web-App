var admin = require('firebase-admin');  


admin.initializeApp({
  apiKey: "AIzaSyAn-ouEkgkO36E0_VsGv5kXj6SvrbgdClo",                             // Auth / General Use
  authDomain: "dragonevents-ac729.firebaseapp.com",         // Auth with popup/redirect
  databaseURL: "https://dragonevents-ac729.firebaseio.com", // Realtime Database
  storageBucket: "dragonevents-ac729.appspot.com",          // Storage
  messagingSenderId: "119036933680"                  // Cloud Messaging
});
  
  /**
 admin.auth().createUser({
  email: "user@example.com",
  emailVerified: false,
  phoneNumber: "+11234567890",
  password: "secretPassword",
  displayName: "John Doe",
  photoURL: "http://www.example.com/12345678/photo.png",
  disabled: false
})
  .then(function(userRecord) {
    // See the UserRecord reference doc for the contents of userRecord.
    console.log("Successfully created new user:", userRecord.uid);
  })
  .catch(function(error) {
    console.log("Error creating new user:", error);
  });**/