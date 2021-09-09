<template>
    <head>
        <title>Making discussion</title>
    </head>
    <body>
        <div class="main">
            <h1>議論を作成</h1>
            <form @submit.prevent="submit">
                <ul>
                    <li>議論テーマ設定</li>
                    <label class="theme">
                        <input class="themeEdit" v-model="formdata.name" placeholder="テーマを入力">
                    </label>
                    <label class="theme">
                        <p style="white-space: pre-line;"></p>
                        <textarea v-model="formdata.description" placeholder="テーマの説明を入力"></textarea>
                    </label>
                    
                    <li>種別</li>
                    <label class="discussiontype">
                        <input type="radio" name="discussiontype" value="賛成・反対型" v-model="formdata.type">賛成・反対型
                    </label>
                    <label class="discussiontype">
                        <input type="radio" id="type" name="discussiontype" value="ディベート型" v-model="formdata.type">ディベート型
                    </label>
                    <div v-show="formdata.type === 'ディベート型'">
                    <div v-for="(member, index) in formdata.roles" :key="member">
                    <label class="role">
                        {{idList[member.uid]}} : 
                        <input type="radio" :name="'role' + index" value="肯定" v-model="member.role">肯定
                        <input type="radio" :name="'role' + index" value="否定" v-model="member.role">否定
                        <input type="radio" :name="'role' + index" value="審判" v-model="member.role">審判
                    </label>
                    </div>
                    </div>
                    
                    <label class="make">
                    <input type="submit" value="作成">
                    </label>
                </ul>
            </form>

            <div class="footer">
            
            </div>
        </div>
    </body> 
</template>

<script>
    import firebase from "firebase/app";

    export default {
        async created() {
            this.id = location.pathname.split("/")[2]

            const communities = firebase.firestore().collection("communities")
            const comData = await communities.get()
            comData.forEach(doc => {
                if (this.id === doc.id){
                    this.membersId = doc.data().users
                }
            })

            const users = firebase.firestore().collection("users")
            const userData = await users.get()
            userData.forEach(doc => {
                this.idList[doc.id] = doc.data().name
            })
            
            this.membersId.forEach(doc => {
                this.members.push(this.idList[doc])
                this.formdata.roles.push({uid: doc, role: ""})
            })
        },
        data() {
            return {
                id: '',
                membersId: [

                ],
                members: [

                ],
                idList: {

                },

                redirect: "/",
                formdata: {
                    name: "", description: "", type: "", roles: [],
                }
            }
        },
        methods: {
            submit() {
                let data = this.formdata
                const room = 'discussions'
                firebase.auth().onAuthStateChanged((user) => {
                    if (user) {
                        let disData = {
                            prop: user.uid,
                            community: this.$route.params.cid,
                            name: data['name'],
                            description: data['description'],
                            type: data['type'],
                            timelimit: data['timelimit'],
                            ideaamo: data['ideaamo'],
                            comamo: data['comamo'],
                            scope: data['scope'],
                            dpass: data['dpass'],
                            userRoles: data['roles']
                        }
                        firebase.firestore().collection(room).add(disData)
                            .then((value) => {
                                firebase.firestore().collection('communities').doc(this.$route.params.cid).update({
                                    discussions: firebase.firestore.FieldValue.arrayUnion(value.id)
                                });
                                firebase.firestore().collection('discussions').doc(value.id).collection('posts').add({
                                    commenter: user.uid,
                                    content: "議論を開始しました。",
                                    time: firebase.firestore.Timestamp.now(),
                                    type: "comment-type"
                                });
                                console.log("Data saved successfully!")
                                this.$router.push("/discussion/" + value.id)
                                })
                            .catch((error) => console.log(error))
                    }
                }
            )},
        },
    }
</script>

<style scoped>
    body {
        font-family: "Avenir Next";
    }

    li {
        font-size: 23px;
        list-style: none;
        margin-top: 40px;
        margin-bottom: 5px;
        padding-right: 37px;
    }

    h1 {
        color: #3cd371;
    }

    button {
        margin-top: 20px;
        margin-right: 37px;
    }

    .themeEdit {
        margin-top: 10px;
        outline: none;
        border-radius: 3px;
        font-size: 20px;
        width: 700px;
        height: 30px;
    }

    textarea {
        padding: 0.8em;
        outline: none;
        border-radius: 3px;
        font-size: 16px;
        width: 680px;
        height: 70px;
    }

    .theme {
        display: block;
        padding-right: 37px;
    }

    .discussiontype {
        display: block;
        padding-right: 37px;
    }

    .closeconditions {
        display: block;
        padding-right: 37px;
    }

    .scope {
        display: block;
        padding-right: 37px;
    }

    .make {
        padding-top: 30px;
        padding-right: 37px;
    }
</style>