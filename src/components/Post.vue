<template>
    <div class="post">
        <p><span v-if="isReply()">(Re)</span><span :class="postTypeClass(post.type)">{{ post.type }}</span>
        {{ n }} {{ post.commenter }} {{ format(post.time) }}
        <a href="javascript:void 0" @click="switchForm" class="reply">返信</a>
        </p>
        <p>{{ post.content }}</p>
        <p v-if="hasReply()">
            <a href="javascript:void 0" @click="switchReply">{{ switchingMessage() }}</a>
        </p>
    </div>
    <PostForm v-if="showsForm" :destPath="path"
     :disId="disId" :destId="post.id" @deleted="switchForm"
     @onSubmit="$emit('onFormSubmit')"></PostForm>
    <!--返信を再帰的に呼び出し-->
    <transition @before-enter="beforeEnter" @enter="enter" @after-enter="afterEnter"
     @before-leave="beforeLeave" @leave="leave" @after-leave="afterLeave">
    <ul class="replys" v-if="showsReply">
        <li v-for="(rPost, index) in post.replys" :key="index">
            <Post :n="index + 1" :post="rPost" :disId ="disId"
                :path="path + '/' + (index + 1)"
                @onFormSubmit="$emit('onFormSubmit')">
            </Post>
        </li>
    </ul></transition>
</template>

<script>
import PostForm from "./PostForm.vue"
import typeMap from "../../plugins/typeMap.js"
const moment = require("moment")

export default {
    props: {
        n: Number,
        disId: String,
        post: Object,
        path: String
    },
    emits: ["onFormSubmit"],
    components: {
        PostForm
    },
    data(){
        return{
            showsReply: true,
            showsForm: false
        }
    },
    methods: {
        format(time) {
            return moment(time).format("YYYY-MM-DD HH:mm:ss");
        },
        isReply() {
            return this.post.parentId !== void 0;
        },
        hasReply() {
            return this.post.replys.length != 0;
        },
        switchReply() {
            this.showsReply = !this.showsReply;
        },
        switchingMessage() {
            let nReplys = this.post.replys.length;
            if (this.showsReply) {
                return "▲返信(" + nReplys +")を非表示"
            }
            return "▼返信(" + nReplys + ")を表示"
        },
        postTypeClass(type) {
            if (type in typeMap) {
                return typeMap[type]
            }
            return "unknown-type"
        },
        switchForm() {
            this.showsForm = !this.showsForm
        },
        beforeEnter(el) {
            el.style.height = '0';
        },
        enter(el) {
            el.style.height = el.scrollHeight + 'px';
        },
        afterEnter(el) {
            el.style.height = 'auto';
        },
        beforeLeave(el) {
            el.style.height = el.scrollHeight + 'px';
        },
        leave(el) {
            el.style.height = '0';
        },
        afterLeave(el) {
            el.style.height = 'auto';
        },
    }
}
</script>

<style scoped>
    .post {
        border: solid 0.1rem black;
        border-radius: 20%;
        margin: 1rem auto;
    }

    li {
        list-style-type: none;
        position: relative;
    }

    li::before {
        position: absolute;
        content: "";
        border-left: solid 0.1rem black;
        width: 10px;
        height: calc(100% + 1.25em);
        top: 0;
        left: -1em;
    }

    li:last-child::before {
        height: 2rem;
    }

    li::after {
        position: absolute;
        content: "";
        border-top: solid 0.1rem black;
        width: 1em;
        height: 10px;
        top: 2em;
        left: -1em;
    }

    .v-enter-from, .v-leave-to {
        opacity: 0;
    }
    .v-enter-to, .v-leave-from {
        opacity: 1;
    }
    .v-enter-active{
        transition: height .4s ease-in-out, opacity .4s ease-in-out;
    }
    .v-leave-active{
        transition: height .4s ease-in-out, opacity .2s ease-in-out;
    }

    .reply {
        color: inherit;
    }

    /*タイプ*/
    .agree {
        color: orangered;
    }

    .agree::before {
        content: "〇";
    }

    .disagree {
        color: mediumblue;
    }

    .disagree::before {
        content: "✖";
    }

    .comment-type::before {
        content: "💬"
    }

    .report::before {
        content: "ℹ"
    }

    .question::before {
        content: "Q."
    }

    .answer::before {
        content: "A."
    }
</style>