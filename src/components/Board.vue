<template>
    <ul>
        <li v-for="(post, index) in posts" :key="index">
            <Post :n="index + 1" :post="post" :disId="disId"
                :getPostPathById="getPostPathById">
            </Post>
        </li>
    </ul>
</template>

<script>
import firebase from "firebase/app"
import Post from './Post.vue'

export default {
    props: {
        disId: String,
    },
    data() {
        return {
            posts: []
        }
    },
    components: {
        Post
    },
    methods: {
        loadPosts(){
            let db = firebase.firestore();
            // 投稿を全て取得
            console.log(this.disId)
            let postsRef = db.collection("discussions")
                .doc(this.disId).collection("posts")
            let posts = [];
            postsRef.get().then((snapshot) => {
                for (let doc of snapshot.docs) {
                    let post = doc.data();
                    post.id = doc.id; //idをセット
                    post.replys = []; //返信の配列作成
                    post.time = post.time.toDate(); //日付をDate型に変更
                    posts.push(post)
                }
                console.log(posts)
                this.posts = this.sortByTime(this.makeTree(posts));
            })
        },
        makeTree(posts) {
            for (let post of posts){
                if (typeof post.parentId !== "undefined") {
                post.parent = posts.find((p) => {
                    return p.id == post.parentId;
                });
                post.parent.replys.push(post);
                }
            }
            posts = posts.filter((post) => {
                return typeof post.parentId === "undefined"
            })
            return posts
        },
        sortByTime(tree) {
            let self = this
            tree.sort((a, b) => a.time - b.time);
            for (let node of tree) {
                if (node.replys.length != 0){
                self.sortByTime(node.replys)
                }
            }
            return tree;
        },
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
                return (self.posts.findIndex((p) => {
                return p == post;
                }) + 1).toString();
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
        }
    },
    created() {
        this.loadPosts()
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