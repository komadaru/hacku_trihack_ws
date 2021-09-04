<template>
    <form id="form" @submit.prevent="onSubmit">
        <p><span v-if="isReply()">返信先：{{ destPath }} 
            <button type="button" @click="cancelReplying" onclick="return false">返信をキャンセル</button></span>
         名前：<input type="text" v-model="commenter" required></p>
        <p>コメント：<textarea v-model="content" cols="70" rows="14" required></textarea></p>
        <input type="submit">
    </form>
</template>

<script>
import firebase from "firebase/app";
import "firebase/firestore";

export default {
    props: {
        destPath: String,
        destId: String,
        disId: String
    },
    data(){
        return{
            commenter: "",
            content: "",
        }
    },
    methods: {
        onSubmit() {
            let post = {
                "commenter": this.commenter,
                "content": this.content,
                "time": firebase.firestore.Timestamp.now(),
                "parentId": this.destId
                }
            this.postComment(post);
            this.content = "";
            this.cancelReplying();
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
        isReply(){
            return this.destId !== void 0;
        },
        cancelReplying() {
            this.$emit("deleted")
        }
    },
    created() {
        console.log(this.destId)
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