<template>
  <div class="container-sm">
    <h1>興味のあることでユーザーを検索してみよう！</h1>
    <form @submit.prevent="onSubmit">
      <div class="input-group">
        <input 
          type="text"
          v-model="word"
          class="form-control"
        >
        <input
          type="submit"
          class="btn btn-primary"
        >
        <button 
          type="button"
          @click="clear"
          class="btn btn-danger"
        >クリア</button>
      </div>
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
            <p>興味ある事：
              <span
                v-for="word in user.interests"
                :key="word"
              >
              <router-link
                :to="'/search-user?q=' + word"
                style="margin-right: 0.5rem">
                {{word}}
              </router-link>
              </span>
            </p>
          </div>
        </div>
      </li>
      <span v-if="users.length == 0">見つかりません</span>
    </ul>
  </div>
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
      searchUserByProf(query) {
        if (typeof query === "undefined") {
          this.users = [];
          return
        }
        let db = firebase.firestore();
        let usersRef = db.collection("users");
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
        this.$router.push('/search-user?q=' + this.word)
      },
      clear() {
        this.word = "";
        this.$router.push('/search-user')
      }
    },
    created() {
      this.searchUserByProf(this.$route.query.q)
    },
    // eslint-disable-next-line no-unused-vars
    beforeRouteUpdate(to, from, next) {
      this.searchUserByProf(to.query.q);
      next();
    }
}
</script>

<style scoped>
li {
    list-style-type: none;
}
</style>

    