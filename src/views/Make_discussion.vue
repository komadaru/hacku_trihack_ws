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
                    <label class="discussiontype">
                        <input type="radio" id="type" name="discussiontype" value="アイデア募集型" v-model="formdata.type">アイデア募集型
                    </label>
                    <label class="discussiontype">
                        <input type="radio" id="type" name="discussiontype" value="複数選択型" v-model="formdata.type">複数選択型
                    </label>
                    
                    <li>クローズ条件</li>
                    <label class="closeconditions">
                        <input type="radio" name="closeauto" value="manual-close" v-model="formdata.closeauto">手動クローズ
                    </label>
                    <label class="closeconditions">
                        <input type="radio" name="closeauto" value="auto-close" v-model="formdata.closeauto">自動クローズ
                    </label>
                    <div v-show="formdata.closeauto==='auto-close'">
                    <label class="closeconditions">
                        <input type="checkbox" name="closeconditions" value="期限を設定" v-model="showCal">期限を設定
                    <div v-show="showCal">
                        <flat-pickr placeholder="日時を入力" v-model="formdata.timelimit" :config="config"></flat-pickr>
                    </div>
                    </label>
                    <label class="closeconditions">
                    <div v-show="formdata.type==='アイデア募集型'">
                        <input type="checkbox" id="clc" name="closeconditions" value="上限アイデア数を設定" v-model="showIdeaAmo">上限アイデア数を設定
                        <div v-show="showIdeaAmo">
                            <input type="number" step="10" min="0" v-model="formdata.ideaamo">
                        </div>
                    </div>
                    </label>
                    <label class="closeconditions">
                        <input type="checkbox" id="clc" name="closeconditions" value="上限コメント数を設定" v-model="showComAmo">上限コメント数を設定
                        <div v-show="showComAmo">
                            <input type="number" step="10" min="0" v-model="formdata.comamo">
                        </div>
                    </label>
                    </div>
                    
                    <li>公開/非公開設定</li>
                    <label class="scope">
                        <input type="radio" id="oc" name="scope" value="公開" v-model="formdata.scope">公開
                    </label>
                    <label class="scope">
                        <input type="radio" id="oc" name="scope" value="非公開" v-model="formdata.scope">非公開
                    </label>
                    <label class="scope">
                    <div v-show="formdata.scope === '非公開'">
                        <input class="dpass" type="password" v-model="formdata.dpass" placeholder="パスワードを入力">
                    </div>
                    </label>
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
    // Import outside library from main.js
    import flatPickr from 'vue-flatpickr-component';

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
                date: null,
                ideaAmount: 0,
                comAmount: 0,
                // For flatPickr: flatPickrの要素設定
                config: {
                    enableTime: true,
                    dateFormat: "Y-m-d H:i",
                    minDate: null,
                },
                showCal: false,
                showIdeaAmo: false,
                showComAmo: false,

                redirect: "/",
                formdata: {
                    name: "", description: "", type: "", closeauto: true,
                    timelimit: "", ideaamo: "",
                    comamo: "", scope: "", dpass: "", roles: [], 

                }
            }
        },
        components: {
            flatPickr
        },
        // For flatPickr: 現在日時を継続的に更新
        mounted: function() {
            this.updateTime();
            setInterval(this.updateTime, 1000);
        },
        methods: {
            // For flatPickr: 現在日時の1分後を取得し、flatPickerの要素minDateに代入
            updateTime() {
                let currentdate= new Date()
                this.config.minDate = currentdate.getFullYear() + '-' + (currentdate.getMonth() + 1) + '-' +
                currentdate.getDate() + ' ' + currentdate.getHours() + ':' + (currentdate.getMinutes() + 1)
            },

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