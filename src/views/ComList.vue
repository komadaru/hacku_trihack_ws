<template>
  <div class="row row-cols-1 row-cols-md-5 p-3 g-4">
    <div class="col" v-for="(data, index) in myComList" :key="data">
      <div class="card h-100" style="max-width: 18rem;">
        <div class="card-header">
          <h3><strong>{{data["name"]}}</strong></h3>
        </div>
        <div class="card-body">
          <h5 class="card-title"><strong>{{data["description"]}}</strong></h5>
          <h8 class="card-title">[メンバー]</h8>
          <div v-for="member in data.users" :key="member">
            <p class="card-text">{{idList[member]}}</p>
          </div>
          <div class="br"></div>
          <router-link :to="{ path: '/community', query: { com_index: index}}">
            <p class="btn btn-primary">詳細</p>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
  .br {
    margin-bottom: 2em;
  }
</style>

<script>
import firebase from "firebase/app"
export default {
  async created() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.uid = user.uid
      }
    })

    const communities = firebase.firestore().collection("communities")
    const comData = await communities.get()
    comData.forEach(doc => {
      this.comList.push(doc.data())
    })

    const users = firebase.firestore().collection("users")
    const userData = await users.get()
    userData.forEach(doc => {
      this.userList.push(doc.data())
      this.idList[doc.id] = doc.data().name
    })

    this.comList.forEach(doc => {
      let check = "false"
      for (var i = 0; i < doc.users.length; i++) {
        if (this.uid === doc.users[i]){
          check = "true"
        }
      }
    if (check === "true"){
      this.myComList.push(doc)
    }
    })
  },
  data: () => ({
    users: '',
    uid: '',
    idList: {

    },
    comList: [

    ],
    myComList:[

    ],
    userList: [

    ],
    members: [

    ],
    membersList: [

    ],
  })
}
</script>