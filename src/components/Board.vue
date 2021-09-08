<template>
    <ul>
        <li v-for="(post, index) in posts" :key="post.id">
            <Post :post="post" :disId="disId"
                :path="(index + 1).toString()"
                @onFormSubmit="loadPosts">
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
        idUsers: Object, // Map Object
        userRoles: Object
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
            let postsRef = db.collection("discussions")
                .doc(this.disId).collection("posts")
            let posts = [];
            postsRef.get().then((snapshot) => {
                for (let doc of snapshot.docs) {
                    // 投稿のデータを取得
                    let post = doc.data();
                    //idをセット
                    post.id = doc.id;
                    // commenterはユーザーを表すオブジェクトに変換
                    let uid = post.commenter
                    post.commenter = {...this.idUsers.get(post.commenter)};
                    post.commenter.uid = uid;
                    // userRolesが与えられていればrolesを追加
                    if (typeof this.userRoles !== "undefined") {
                        if (this.userRoles.has(post.commenter.uid)) {
                            post.commenter.role
                                = this.userRoles.get(post.commenter.uid)
                        }
                    }
                    post.replys = []; //返信の配列作成
                    post.time = post.time.toDate(); //日付をDate型に変更
                    if ("vote" in post) {
                        // 投票の日付をDate型に変更
                        post.vote.timelimit = post.vote.timelimit.toDate();
                    }
                    if ("ideaEvent" in post) {
                        // アイデア募集の日付をDate型に変更
                        post.ideaEvent.timelimit = post.ideaEvent.timelimit.toDate();
                    }
                    posts.push(post)
                }
                this.posts = this.sortByTime(this.makeTree(posts));
            }).catch(e => console.error(e))
        },
        makeTree(posts) {
            for (let post of posts){
                if (typeof post.parentId !== "undefined") {
                    post.parent = posts.find((p) => {
                        return p.id == post.parentId;
                    });
                    if (typeof post.parent !== "undefined") {
                        post.parent.replys.push(post);
                    } else {
                        delete post.parentId;
                    }
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