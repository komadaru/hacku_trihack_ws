<template>
    <div>
        <div class="mt-3">
            <img class = "bd-placeholder-imag rounded-circle" v-bind:src = "img" width="100" height="100">
        </div>
        <div class="info">
            <h1 class="mt-2">{{name}}</h1>
            <p>{{biography}}</p>
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
    }
  },
  created(){
    let db = firebase.firestore();
    let userRef = db.collection("users").doc(this.$route.params.userId);
    userRef.get().then((doc) => {
        if (doc.exists) {
        this.name = doc.data().name
        this.biography = doc.data().biography
    } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
    }
    }).catch((error) => {
    console.log("Error getting document:", error);
    });
  },
}
</script>