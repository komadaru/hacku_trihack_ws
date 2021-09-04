import firebase from "firebase/app"

<template>
    <head>
        <title>Login Page</title>
    </head>
    <body>
        <h1>Login Page</h1>
    <table>
        <tr><th>Email</th>
        <td><input type="email" v-model="email"></td></tr>
        <tr><th>Password</th>
        <td><input type="password" v-model="password"></td></tr>
        <tr><th></th><td>
            <button @click="login">Login</button>
        </td></tr>
    </table>
    </body>
</template>

<script>
import firebase from "firebase";

export default {
    name: 'Login',
    data: function() {
        return {
            email: '',
            password: ''
        }
    },
    methods: {
        login: function() {
            firebase.auth().signInWithEmailAndPassword(this.email, this.password).then(
                // eslint-disable-next-line no-unused-vars
                user => {
                    alert('Success!')
                    this.$router.push('/')
                },
                err => {
                    alert(err.message)
                }
            )
        }
    }
}
</script>

<style scoped>

</style>