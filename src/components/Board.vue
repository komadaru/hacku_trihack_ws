<template>
    <ul>
        <li v-for="(post, index) in posts" :key="index">
            <Post :n="index + 1" :time="post.time" :id="post.id" 
                :commenter="post.commenter" :comment="post.comment"
                :replys="post.replys"
                :setId="setId" :getPostPathById="this.getPostPathById">
            </Post>
        </li>
    </ul>
</template>

<script>
import Post from './Post.vue'

export default {
    props: {
        posts: Object
    },
    components: {
        Post
    },
    methods: {
        
    }
}
</script>

<style scoped>
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
</style>