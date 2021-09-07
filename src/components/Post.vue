<template>
    <div :class="['post-wrapper',{'vote-section':post.type==='投票'}]">
    <div class="post">
        <p>
            <span v-if="isReply()">
                <span v-if="isVote()">(投票)</span>
                <span v-else>(Re)</span>
            </span>
            <span v-if="isVote()" :class="['choice', postTypeClass(post.voteChoice)]">
                {{post.voteChoice}}</span>
            <span v-else :class="['type', postTypeClass(post.type)]">
                {{ post.type }}</span>
            <span class="path">コメントNo: ({{ path }}) </span>
            <span class="commenterName">コメントした人:{{ post.commenterName }}</span>
        </p>
        <p>{{ format(post.time) }}
        <a href="javascript:void 0" @click="switchForm" class="reply">返信</a>
        </p>
        <p>{{ post.content }}</p>
        <VoteInfo v-if="post.type==='投票'" :post="post"
        :vote="post.vote">
        </VoteInfo>
        <p v-if="hasReply()">
            <a href="javascript:void 0" @click="switchReply">{{ switchingMessage() }}</a>
        </p>
    </div>
    <transition @before-enter="beforeEnter" @enter="enter" @after-enter="afterEnter"
     @before-leave="beforeLeave" @leave="leave" @after-leave="afterLeave">
    <PostForm v-if="showsForm" :destPath="path" :replyingVote="post.vote"
     :disId="disId" :destId="post.id" @deleted="switchForm"
     @onSubmit="$emit('onFormSubmit')"></PostForm>
    </transition>
    <!--返信を再帰的に呼び出し-->
    <transition @before-enter="beforeEnter" @enter="enter" @after-enter="afterEnter"
     @before-leave="beforeLeave" @leave="leave" @after-leave="afterLeave">
    <ul class="replys" v-show="showsReply">
        <li v-for="(rPost, index) in post.replys" :key="index">
            <Post :n="index + 1" :post="rPost" :disId ="disId"
                :path="path + '/' + (index + 1)"
                @onFormSubmit="$emit('onFormSubmit')">
            </Post>
        </li>
    </ul></transition>
    </div>
</template>

<script>
import PostForm from "./PostForm.vue"
import VoteInfo from "./VoteInfo.vue"
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
        PostForm,
        VoteInfo
    },
    data(){
        return{
            showsReply: this.showsReplyDefalut(),
            showsForm: false
        }
    },
    methods: {
        format(time) {
            return moment(time).format("YYYY-MM-DD HH:mm:ss");
        },
        isReply() {
            return typeof this.post.parentId !== "undefined";
        },
        isVote() {
            return typeof this.post.voteChoice !== "undefined";
        },
        showsReplyDefalut() {
            /* 親のpostが存在し、それが投票ならば
            デフォルトで表示しない*/
            let hasParent = typeof this.post.parent !== "undefined";
            return !(hasParent && this.post.parent.type === "投票")
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
    .type, .choice {
        border: solid 0.1rem;
        border-radius: 15%;
    }
    .choice::after {
        content: "🗳"
    }
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
    .vote::before {
        content: "🗳"
    }

    .close {
        color: green;
    }
    .close::before {
        content: "✓"
    }

    /*セクション*/
    .vote-section {
        border: solid 0.1rem;
        background: paleturquoise;
    }
</style>