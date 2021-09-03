<template>
    <ul>
        <li v-for="(post, index) in posts" :key="index">
            <Post :n="index + 1" :time="post.time" :id="post.id" 
                :commenter="post.commenter" :comment="post.comment"
                :replys="post.replys"
                :getPostPathById="getPostPathById">
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
        getPostPathById(id){
            let post = this.getPostById(id)
            return this.getPostPath(post)
        },
        getPostPath(post) {
            let index = this.getPostIndexById(post.id)
            if (typeof post.parent === "undefined") {
                return index       
            } else {
                let parentPath = this.getPostPath(post.parent)
                return parentPath + "/" + index
            }
        },
        getPostIndexById(id) {
            let self = this
            let post = self.getPostById(id)
            // 返信ではないpostの場合そのままのインデックスを取得
            if (post.parentId === void 0) {
                return self.posts.findIndex((p) => {
                return p == post;
                }) + 1;
            }
            // 返信である場合、親の返信の中でのインデックスを取得する
            return post.parent.replys.findIndex((p) => {
                return p == post;
            }) + 1;
        },
        getPostById(id) {
            let self = this
            for (let post of self.posts) {
                let ret = self.searchPostById(post, id);
                if (ret !== null) return ret
            }
            return null;
        },
        searchPostById(currentPost, id) {
            // そのpostのidが探しているものと一致するならそれを返す
            if (currentPost.id == id) {
                return currentPost
            }
            // 全ての返信を探す
            for (let reply of currentPost.replys) {
                let ret = this.searchPostById(reply, id)
                if (ret !== null) return ret;
            }
            return null;
        },
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