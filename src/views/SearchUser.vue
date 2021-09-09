<template>
    <h1>ユーザー検索</h1>
    <form @submit.prevent="onSubmit">
      <input type="text" v-model="word"><input type="submit">
    </form>
    <ul>
      <li v-for="(user, index) of users" :key="user.uid" class="mb-3">
        <div class="card">
          <div class="card-header">
            No.{{index + 1}} 
            <router-link :to="'/user/' + user.uid">
              名前：{{user.name}}
            </router-link>
            </div>
          <div class="card-body">
            <p>id：{{user.uid}}</p>
            <p>興味ある事：{{user.interests.join(", ")}}</p>
          </div>
        </div>
      </li>
      <span v-if="users.length == 0">見つかりません</span>
    </ul>
</template>

<script>
import firebase from "firebase/app"
import "firebase/auth"
import "firebase/firestore"

export default {
    name: "SearchUser",
    data() {
      return {
        word: "",
        users: []
      }
    },
    methods: {
      searchUserByProf() {
        let db = firebase.firestore();
        let usersRef = db.collection("users");
        let query = this.$route.query.q;
        if (typeof query === "undefined") {
          return
        }
        let qRef = usersRef
          .where("interests", "array-contains", query)
        qRef.get().then((snapShot) => {
          let users = [];
          for (let doc of snapShot.docs) {
            let data = doc.data();
            let user = {};
            user.uid = doc.id;
            let properties = new Map([
              ["name", "不明な名前"],
              ["interests", "（なし）"]
              ])
            for (let [key, value] of properties) {
              if (key in data) {
                user[key] = data[key];
              } else {
                user[key] = value
              }
            }
            users.push(user)
          }
          this.users = users;
        })
      },
      onSubmit() {
        console.log(this.word)
        this.$router.push('/search-user?q=' + this.word)
          .then(() => this.searchUserByProf())
      }
    }
}
</script>

<style scoped>
li {
    list-style-type: none;
}
</style>

    