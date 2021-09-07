<template>
    <h1>コミュニティ作成</h1>
    <form id="form1" @submit.prevent="onSubmit">
        <p>コミュニティの名前：<input type="text" v-model="comName" required></p>
        <p>説明：<input type="text" v-model="description" placeholder="任意"></p>
        <p>追加するアカウントのID(UID)：</p>
        <ul class="uid-inputs">
            <li v-for="(addingUid, index) in addingUids" :key="addingUid">
                <input type="text" v-model="addingUids[index]">
            </li>
        </ul>
        <button type="button" @click="addUidInput">+別のIDを追加</button>
        <input type="submit">
        <p>※IDを入力しなかった場合、一人だけのコミュニティを作成できます。</p>
        <p>{{ message }}</p>
    </form>
</template>

<script>
import firebase from "firebase/app"
import "firebase/auth"
import "firebase/firestore"

export default {
    name: "Make_community",
    data() {
        return {
            comName: "",
            description: "",
            addingUids: [""],
            message: "",
            currentUid: ""
        }
    },
    methods: {
        addUidInput() {
            if (!this.addingUids.includes("")) {
                this.addingUids.push("");
            }
        },
        onSubmit(){
            const self = this
            let db = firebase.firestore();
            let col = db.collection("users")
            /* 入力されたuidをdbから探すpromiseを全て発行
            存在しないuidがひとつでもあれば追加しない*/
            let promises = [];
            for (let addingUid of self.addingUids) {
                if (addingUid !== "") {
                    promises.push(col.doc(addingUid).get())
                }
            }
            Promise.all(promises).then((values) => {
                let allUserExists = true
                for (let value of values) {
                    if (!value.exists) {
                        self.message = value.id + "は存在しません。"
                        allUserExists = false
                        break
                    }
                }
                if (allUserExists) {
                    // Firestoreのコミュニティcollectionに追加
                    let newCommunity = {
                        name: self.comName,
                        description: self.description,
                        users: self.addingUids.concat(this.currentUid),
                        discussions: []
                    };
                    col = db.collection("communities");
                    col.add(newCommunity).then((docRef) => {
                        self.message = "コミュニティを作成しました id:" + docRef.id
                        self.$router.push("/discussion/" + docRef.id)
                    })
                }
            });
        }
    },
    created() {
        //デバッグ用
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                this.currentUid = user.uid;
            } else {
                console.error("ログインしていません")
            }
        });
    }
}
</script>

<style>
ul.uid-inputs {
    list-style-type: none;
}
</style>

    