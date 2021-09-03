<template>
    <form id="form" @submit.prevent="onSubmit">
        <p><span v-if="isReply">返信先：{{ destNum }} 
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
    },
    data(){
        return{
            commenter: "",
            content: "",
            parentId: void 0,
            isReply: false,
            destNum: 0
        }
    },
    methods: {
        onSubmit() {
            let post = {
                "commenter": this.commenter,
                "content": this.content,
                "time": firebase.firestore.Timestamp.now(),
                "parentId": this.parentId
                }
            this.$emit("onSubmit", post);
            this.content = "";
            this.cancelReplying();
        },
        setId(id, destNum) {
            console.log(destNum + "(id:" + id + ")に返信");
            this.parentId = id;
            this.destNum = destNum
            this.isReply = true;
        },
        cancelReplying() {
            this.parentId = void 0;
            this.isReply = false;
        }
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