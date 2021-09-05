<template>
    <div class="signup">
        <h2>サインアップ</h2>
        <input type="email" placeholder="Eメールアドレス" v-model="email">
        <input type="password" placeholder="パスワード" v-model="password">
        <button @click="signup();">登録</button>
        <p>アカウントをすでに持っていますか？ 
        <router-link to="/">サインインへ</router-link>
        </p>
    </div>
</template>

<script>
import firebase from "firebase/app";

export default {
    name: 'Signup',
    data() {
        return {
            id: '',
            email: '',
            password: '',
        }
    },
    methods: {
        signup() {
            firebase.auth().onAuthStateChanged((user) => {
                if (user) {
                    this.id = user.uid;
                }
            })
            firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
                .then(user => {
                    alert('Created accout: ', user.email)
                    this.$router.push('/')
                })
                .catch(error => {
                    alert(error.message)
                })
        },
    }
}
</script>

<style scoped>
.signup {
    margin-top: 30px;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
}

input {
    margin: 10px 0;
    padding: 10px;
}
</style>
