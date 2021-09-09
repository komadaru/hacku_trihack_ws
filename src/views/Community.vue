<template>
    <h1><strong>{{com["name"]}}</strong></h1>
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
            <h4><strong>{{com["description"]}}</strong></h4>
        </div>
        <div id="member" class="tab-pane" role="tabpanel" aria-labelledby="member-tab">
            <div class="col" v-for="member in com.users" :key="member">
                <router-link class='link' :to="{ path: '/user/' + member}">
                    <h4><strong>{{idList[member]}}</strong></h4>
                </router-link>
            </div>
        </div>
        <div id="contact" class="tab-pane" role="tabpanel" aria-labelledby="discussion-tab">
            <div class="col" v-for="discussion in disList" :key="discussion">
                <router-link class='link' :to="{ path: '/discussion/' + discussion}">
                    <h4><strong>{{discussion}}</strong></h4>
                </router-link>
            </div>
            <div class="br"></div>
            <router-link :to="{ path: '/make_discussion/' + com_id}">
                <p class="btn btn-primary">議論作成</p>
            </router-link>
        </div>
    </div>
</template>

<style>
.link{
    text-decoration: none;
    color: black;
}
  
.br {
    margin-bottom: 2em;
}
</style>

<script>
import firebase from "firebase/app"
export default {
  async created() {
    this.com_index = this.$route.query.com_index;

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.uid = user.uid
      }
    })

    const communities = firebase.firestore().collection("communities")
    const comData = await communities.get()
    comData.forEach(doc => {
      this.comList.push(doc.data())
      this.comIdList.push(doc.id)
      this.comIdDict[doc.data().name] = doc.id
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

    this.com = this.myComList[this.com_index]

    this.com_id = this.comIdDict[this.com.name]

    this.disList = this.com.discussions
  },
  data: () => ({
    com_index: '',
    com_id: '',
    uid: '',
    com: '',
    idList: {

    },
    comIdDict: {

    },
    comList: [

    ],
    comIdList: [

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
    disInfo: [
      
    ]
  })
}
</script>