<template>
  <form v-on:submit.prevent = "edit">
    <p>名前：<input type = "text" v-model = "newname"></p>
    <p>自己紹介：<textarea v-model = "newbiography"></textarea></p>
    <p>興味のあることを入力<textarea v-model= "interests"></textarea></p>
    <button type = "submit">更新</button>
  </form>
</template>
<script>
import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
export default { 
  data(){
    return{
      newname:'',
      newbiography:'',
      interests:"",
    }
  },
  methods:{
      edit:function(){
        let db = firebase.firestore();
        let userRef = db.collection("users").doc(this.$route.params.userId);
        userRef.update({
            name:this.newname,
            biography:this.newbiography,
            interests:this.interests.split(/\n|\r\n/).filter(e => e !== "")


        }).then(() => {
            console.log("Document successfully written!");
            this.$router.push('/user/' + this.$route.params.userId);
        }).catch((error) => {
            console.error("Error writing document: ", error);
        });

      }
  }
}
</script>