<template>
    <head>
        <title>Signup Page</title>
    </head>
    <body>
        <h1>Signup Page</h1>
    <table>
        <tr><th>Email</th>
        <td><input type="email" v-model="email"></td></tr>
        <tr><th>Password</th>
        <td><input type="password" v-model="password"></td></tr>
        <tr><th></th><td>
            <button @click="signup">Sign up</button>
        </td></tr>
    </table>
    </body>
</template>

<script>
import firebase from "firebase";

export default {
    name: 'Signup',
    data: function() {
        return {
            email: '',
            password: ''
        }
    },
    methods: {
        signup: function() {
            firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
                .then(user => {
                    alert('Create accout: ', user.email)
                    this.$router.push('/')
                })
                .catch(error => {
                    alert(error.message)
                })
        }
    }
}
</script>

<style scoped>

</style>
