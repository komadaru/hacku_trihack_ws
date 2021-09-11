<template>
    <div>
        <div class="info">
            <h1>{{name}}</h1>
            <p>ID : {{uid}}</p>
        </div>
        <div class="bio">
            <h2>自己紹介</h2>
            <p>{{biography}}</p>
        </div>
        <div class="int">
            <ul>
              <h2>興味のあること</h2>
              <router-link :to="{path:'/search-user', query: { q: interest}}">
                <li v-for = "interest in interests" :key = "interest">
                  {{interest}}
                </li>
              </router-link>
            </ul>
        </div>
        <div v-show="uid === id">
          <router-link :to="{ path:'/user/' + this.$route.params.userId + '/user_edit'}">
              <p class="btn btn-primary">編集</p>
          </router-link>
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
<style>
.bio {
  box-shadow :0px 0px 3px silver;
  border: solid 1px whitesmoke;
  padding: 0.5em 1em 0.5em 2.3em;
  position: relative;
  background: #fafafa;
}
.int ul {
  box-shadow :0px 0px 3px silver;
  border: solid 1px whitesmoke;
  padding: 0.5em 1em 0.5em 2.3em;
  position: relative;
  background: #fafafa;
}
.int ul li {
  line-height: 1.5;
  padding: 0.5em 0;
  list-style-type: none!important;
}
</style>