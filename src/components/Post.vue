<template>
    <div class="post">
        <p><span v-if="isReply">Re:</span>
        {{ n }} {{ commenter }} {{ format(time) }}
        <a href="#form" @click="setId(id, getPostPathById(id))" class="reply">返信</a>
        </p>
        <p>{{ comment }}</p>
        <p v-if="hasReply()">
            <a href="javascript:void 0" @click="switchReply">{{ switchingMessage(replys.length) }}</a>
        </p>
    </div>
    <!--返信を再帰的に呼び出し-->
    <transition @before-enter="beforeEnter" @enter="enter" @after-enter="afterEnter"
     @before-leave="beforeLeave" @leave="leave" @after-leave="afterLeave">
    <ul class="replys" v-if="showsReply">
        <li v-for="(post, index) in replys" :key="index">
            <Post :n="index + 1" :time="post.time" :id="post.id"
                :commenter="post.commenter" :comment="post.comment"
                :replys="post.replys" :isReply="true"
                :setId="setId" :getPostPathById="getPostPathById">
            </Post>
        </li>
    </ul></transition>
</template>

<script>
const moment = require("moment")

export default {
    props: {
        n: Number,
        commenter: String,
        time: Date,
        id: String,
        comment: String,
        replys: Array,
        isReply: Boolean,
        setId: Function,
        getPostPathById: Function
    },
    emits: ["replyLinkClicked"],
    data(){
        return{
            posts: {},
            showsReply: true,
        }
    },
    methods: {
        format(time) {
            return moment(time).format("YYYY-MM-DD HH:mm:ss");
        },
        hasReply() {
            return this.replys.length != 0;
        },
        switchReply() {
            this.showsReply = !this.showsReply;
        },
        switchingMessage(nReplys) {
            if (this.showsReply) {
                return "▲返信(" + nReplys +")を非表示"
            }
            return "▼返信(" + nReplys + ")を表示"
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
</style>