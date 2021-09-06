<template>
    <form id="form" @submit.prevent="onSubmit">
        <label v-if="isVote()">
            投票：<select v-model="voteChoice" required>
                <option :value="choice" v-for="choice in replyingVote.choices" :key="choice">{{choice}}</option>
            </select>
        </label>
        <label v-else>
            タイプ：
            <select v-model="type" required>
                <option :value="key" v-for="(t,key) in types()" :key="key">{{key}}</option>
            </select>
        </label>
        <label>
            <span v-if="isReply()">返信先：{{ destPath }} 
            <button type="button" @click="deleteForm" onclick="return false">返信をキャンセル</button></span>
         名前：{{ name }}
         </label>
         <div v-if="type==='投票'">
            <h3>投票作成</h3>
            <div>選択肢：
                <p 
                    v-for="(choice, index) in creatingVote.choices"
                    :key="index">
                    <input type="text" v-model="creatingVote.choices[index]">
                    <button 
                        type="button"
                        @click="addChoicesInput"
                        v-if="index==creatingVote.choices.length - 1">
                        追加
                    </button>
                </p>
            </div>
            <label>一人が投票できる回数：
                <input
                    type="number"
                    v-model="creatingVote.nChoicesPerPerson">
            </label>
            <br/>
            <label>
                期日：
            <flatPickr
                placeholder="期日を入力"
                :config="{enableTime:true}"
                v-model="creatingVote.timelimit"
                @on-change="test">
            </flatPickr>
            </label>
         </div>
        <label>コメント：<textarea v-model="content" cols="70" rows="14" required></textarea></label>
        <input type="submit">
        <button type="button" @click="clear">すべてクリア</button>
    </form>
</template>

<script>
import firebase from "firebase/app";
import "firebase/firestore";
import typeMap from "../../plugins/typeMap.js"
import flatPickr from 'vue-flatpickr-component';

export default {
    props: {
        destPath: String,
        destId: String,
        disId: String,
        replyingVote: Object
    },
    components: {
        flatPickr
    },
    data(){
        return{
            type: "コメント",
            name: "",
            commenter: "",
            content: "",
            voteChoice: void 0,
            creatingVote: {
                choices: [""],
                nChoicesPerPerson: 1,
                timelimit: new Date()
            }
        }
    },
    methods: {
        onSubmit() {
            let post = {
                "type": this.type,
                "commenter": this.commenter,
                "content": this.content,
                "time": firebase.firestore.Timestamp.now(),
                "parentId": this.destId,
                "voteChoice": this.voteChoice
                }
            if (this.type === "投票") {
                post.vote = this.creatingVote;
                // Timestamp型に変換
                post.vote.timelimit
                    = firebase.firestore.Timestamp.fromDate(
                        new Date(post.vote.timelimit))
                // 空文字を除去
                post.vote.choices = post.vote.choices.filter((el) => {return el !== ""})
            }
            this.postComment(post);
            this.$emit("onSubmit")
            this.clear();
            if (this.isReply()) {this.deleteForm();}
        },
        postComment(postData) {
            let db = firebase.firestore();
            let col = db.collection("discussions").doc(this.disId)
                .collection("posts");
            col.add(postData)
            .then((docRef) => {
                console.log("コメントを送信しました", docRef.id)
            })
            .catch((e) => {
                console.error("コメントの送信に失敗しました", e)
            })
        },
        setUser() {
            firebase.auth().onAuthStateChanged((user) => {
                if (user) {
                    this.commenter = user.uid
                    firebase.firestore().collection("users")
                        .doc(this.commenter).get()
                        .then((doc) => this.name = doc.data().name)
                        .catch(() => this.name = "ユーザー名が取得できません")
                } else {
                    console.error("ログインしていません")
                }
            });
        },
        types() {
            return typeMap
        },
        isReply(){
            return typeof this.destId !== "undefined";
        },
        isVote() {
            return typeof this.replyingVote !== "undefined";
        },
        clear() {
            this.type = "コメント";
            this.commenter = "";
            this.content = "";
            this.voteChoice = void 0;
            this.creatingVote = {
                choices: [""],
                nChoicesPerPerson: 1,
                timelimit: new Date()
            };
        },
        deleteForm() {
            this.$emit("deleted")
        },
        addChoicesInput() {
            if (!this.creatingVote.choices.includes("")) {
                this.creatingVote.choices.push('')
            }
        }
    },
    created() {
        this.setUser()
    }
}
</script>

<style scoped>
    form {
        border: solid 0.1rem black;
    }

    textarea {
        max-width: 80%;
    }
</style>