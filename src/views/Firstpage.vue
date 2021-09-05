<template>
    <topbar />
    <div class="flex">
        <div class="icon">
            <img v-bind:src = "img" width="100" height="100">
        </div>
        <div class="info">
            <h1>{{}}</h1>
        </div>
        <button type="button" @click = "checkUid"></button>
        <router-link :to="{ name: 'user', params: { userId: 123 }}">User</router-link>
    </div>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import Topbar from '@/components/layouts/Topbar'
export default {
  data(){
    return{
      img:"",
      name:"",
    }
  },
  components: {
    Topbar
  },
  methods:{
    checkUid(){
    const user = firebase.auth().currentUser;
    if(user){
        user.uid
      }else{
        console.log("ログインしていない")
      }
    }
  }
}
</script>