<template>

    <h1>{{myComList["name"]}}</h1>
    <ul id="myTab" class="nav nav-tabs nav-justified mb-3" role="tablist">
        <li class="nav-item" role="presentation">
            <button type="button" id="description-tab" class="nav-link active" data-bs-toggle="tab" data-bs-target="#description" role="tab" aria-controls="description" aria-selected="true">説明</button>
        </li>
        <li class="nav-item" role="presentation">
            <button type="button" id="member-tab" class="nav-link" data-bs-toggle="tab" data-bs-target="#member" role="tab" aria-controls="member" aria-selected="false">メンバー</button>
        </li>
        <li class="nav-item" role="presentation">
            <button type="button" id="discussion-tab" class="nav-link" data-bs-toggle="tab" data-bs-target="#contact" role="tab" aria-controls="discussion" aria-selected="false">議論</button>
        </li>
    </ul>

    <div id="myTabContent" class="tab-content">
        <div id="description" class="tab-pane active" role="tabpanel" aria-labelledby="description-tab">
            <h4><strong>{{myComList["description"]}}</strong></h4>
        </div>
        <div id="member" class="tab-pane" role="tabpanel" aria-labelledby="member-tab">
            <div class="col" v-for="member in membersList" :key="member">
                <router-link class='link' :to="{ path: '/community', query: { com_id: index}}">
                    <h4><strong>{{member}}</strong></h4>
                </router-link>
            </div>
        </div>
        <div id="contact" class="tab-pane" role="tabpanel" aria-labelledby="discussion-tab">
            <div class="col" v-for="discussion in disList" :key="discussion">
                <router-link class='link' :to="{ path: '/community', query: { com_id: index}}">
                    <h4><strong>{{discussion}}</strong></h4>
                </router-link>
            </div>
        </div>
    </div>
</template>

<style>
.link{
    text-decoration: none;
    color: black;
}
</style>

<script>
import firebase from "firebase/app"
export default {
  async created() {
    this.com_id = this.$route.query.com_id;

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

    this.myComList = this.myComList[this.com_id]

    this.membersList = this.membersList[this.com_id]

    this.disList = this.myComList.discussions
  },
  data: () => ({
    com_id: '',
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
    disList: [

    ],
  })
}
</script>