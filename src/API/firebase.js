import * as firebase from 'firebase';

const firebaseConfig = {
    databaseURL: "https://maison-405bd.firebaseio.com/",
    storageBucket: 'transactions'
};
export default firebaseApp = firebase.initializeApp(firebaseConfig);