<template>
  
  <div class="row row-cols-1 row-cols-md-5 p-3 g-4">
    <div class="col" v-for="(data, index) in myComList" :key="data">
      <div class="card h-100" style="max-width: 18rem;">
        <div class="card-header">
          <h3>{{data["name"]}}</h3>
        </div>
        <div class="card-body">
          <h5 class="card-title">{{data["description"]}}</h5>
          <h8 class="card-title">[メンバー]</h8>
          <div v-for="member in membersList[index]" :key="member">
            <p class="card-text">{{member}}</p>
          </div>
          <p></p>
          <router-link :to="{ path: '/community', query: { com_id: index}}">
            <a href="/community" class="btn btn-primary">詳細</a>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from "firebase/app"
export default {
  async created() {
    const communities = firebase.firestore().collection("communities")
    const comData = await communities.get()
    comData.forEach(doc => {
      this.comList.push(doc.data())
    })

    const users = firebase.firestore().collection("users")
    const userData = await users.get()
    userData.forEach(doc => {
      this.userList.push(doc.data())
    })

    this.comList.forEach(doc => {
      let check = "false"
      for (var i = 0; i < doc.users.length; i++) {
        if (this.myId === doc.users[i]){
          check = "true"
        }
      }
    if (check === "true"){
      this.myComList.push(doc)
    }
    })

    this.myComList.forEach(doc => {
      this.idList.push(doc.users)
    })    

    this.idList.forEach(doc1 => {
      for (var i = 0; i < doc1.length; i++) {
        this.userList.forEach(doc2 => {
          if (doc1[i] === doc2.id){
            this.members.push(doc2.name)
          }
        })
      }
      this.membersList.push(this.members)
      this.members = []
    })
  },
  data: () => ({
    myId: "3iBbPkXJEKb8AqTkYQxfD9UUKsV2",
    idList: [

    ],
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