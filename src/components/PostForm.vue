<template>
    <form id="form" @submit.prevent="onSubmit">
        <label v-if="isVote()">
            投票：<select v-model="voteChoice" required>
                <option :value="choice" v-for="choice in vote.choices" :key="choice">{{choice}}</option>
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
        <label>コメント：<textarea v-model="content" cols="70" rows="14" required></textarea></label>
        <input type="submit">
    </form>
</template>

<script>
import firebase from "firebase/app";
import "firebase/firestore";
import typeMap from "../../plugins/typeMap.js"

export default {
    props: {
        destPath: String,
        destId: String,
        disId: String,
        vote: Object
    },
    data(){
        return{
            type: "コメント",
            name: "",
            commenter: "",
            content: "",
            voteChoice: void 0,
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
            return typeof this.vote !== "undefined";
        },
        clear() {
            this.commenter = "";
            this.content = "";
        },
        deleteForm() {
            this.$emit("deleted")
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