import {initializeApp} from 'firebase/app'
import {getFirestore} from 'firebase/firestore' //possibilita conexão com o banco
import {getAuth} from 'firebase/auth'



const firebaseConfig = {
    apiKey: "AIzaSyBoJj5lgDGuezkFxF8eh9WJfxijWXTDfss",
    authDomain: "teste-5ce8c.firebaseapp.com",
    projectId: "teste-5ce8c",
    storageBucket: "teste-5ce8c.appspot.com",
    messagingSenderId: "751561558207",
    appId: "1:751561558207:web:845436d8995bbe61589e0a",
    measurementId: "G-6JK9Z69061"
  };

  const firebaseApp = initializeApp(firebaseConfig)  //inicialização do firebase
  const db = getFirestore(firebaseApp)  //inicialização do getFirebaseApp

  const auth = getAuth(firebaseApp) //inicialização da autenticação

  export {db, auth}