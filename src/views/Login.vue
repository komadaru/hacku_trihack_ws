<template>
    <img v-bind:src="require('../assets/dplogo.png')">
    <div class="signin">
        <h2>サインイン</h2>
        <input type="email" placeholder="Eメールアドレス" v-model="email">
        <input type="password" placeholder="パスワード" v-model="password">
        <button @click="login">サインイン</button>
        <p>アカウント作成はお済みですか？ 
        <router-link to="./signup">サインアップへ</router-link>
        </p>
    </div>
</template>

<script>
import firebase from "firebase";

export default {
    name: 'Login',
    data() {
        return {
            email: '',
            password: ''
        }
    },
    methods: {
        login() {
            firebase.auth().signInWithEmailAndPassword(this.email, this.password).then(
                // eslint-disable-next-line no-unused-vars
                result => {
                    this.id = result.user.uid;
                    alert('Success!')
                    this.$router.push('/user/' + result.user.uid)
                },
                err => {
                    alert(err.message)
                }
            )
        },
    }
}
</script>

<style scoped>
.signin {
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