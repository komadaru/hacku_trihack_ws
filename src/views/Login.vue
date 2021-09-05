<template>
    <div class="signin">
        <h1>サインイン</h1>
        <input type="email" placeholder="Eメールアドレス" v-model="email">
        <input type="password" placeholder="パスワード" v-model="password">
        <button @click="login">サインイン</button>
    </div>
</template>

<script>
import firebase from "firebase";

export default {
    name: 'Login',
    data() {
        return {
            id: '',
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
                    this.createdoc();
                    alert('Success!')
                    this.$router.push('/user/' + result.user.uid)
                },
                err => {
                    alert(err.message)
                }
            )
        },
        createdoc() {
            let userData = {
                id: this.id,
                email: this.email,
                password: this.password,
            }
            var db = firebase.firestore();
            db.collection('users').doc(this.id).set(userData)
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