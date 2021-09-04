import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

// Initialize firebase
let config = {
    apiKey: "AIzaSyDYyZZeuo_5HlgyrHrhyYZUb4n3AaERx9Q",
    authDomain: "project-of-trihack.firebaseapp.com",
    projectId: "project-of-trihack",
    storageBucket: "project-of-trihack.appspot.com",
    messagingSenderId: "559325421489",
    appId: "1:559325421489:web:5f54444d9c28e3de08a790",
    measurementId: "G-H2B94N0G9D"
};
firebase.initializeApp(config);

firebase.firestore().settings({ignoreUndefinedProperties:true})
createApp(App).use(store).use(router).mount('#app')
