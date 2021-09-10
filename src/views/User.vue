<template>
    <div>
        <div class="mt-3">
            <img class = "bd-placeholder-imag rounded-circle" v-bind:src = "img" width="100" height="100">
        </div>
        <div class="info">
            <h1 class="mt-2">{{name}}</h1>
            <p>{{biography}}</p>
            <p>ID : {{uid}}</p>
            <ul>
              <p v-for = "interest in interests" :key = "interest">{{interest}}</p>
            </ul>
            <div v-show="uid === id">
              <router-link :to="{ path:'/user/' + this.$route.params.userId + '/user_edit'}">
                  <p class="btn btn-primary">編集</p>
              </router-link>
            </div>
        </div>
    </div>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
export default {
  data(){
    return{
      img:"",
      name:"",
      biography:"",
      uid:"",
      interests:"",
      id:""
    }
  },
  created(){
    let db = firebase.firestore();
    let userRef = db.collection("users").doc(this.$route.params.userId);
    userRef.get().then((doc) => {
        if (doc.exists) {
        this.name = doc.data().name
        this.biography = doc.data().biography
        this.uid=doc.id
        this.interests=doc.data().interests
    } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
    }
    }).catch((error) => {
    console.log("Error getting document:", error);
    });
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.id = user.uid
      }
    })
  },
}
</script>