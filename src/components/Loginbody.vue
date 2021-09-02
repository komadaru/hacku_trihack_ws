<template>
    <div>
        <h1>Login Page</h1>
        <p>{{ msg }}</p>
        <div>{{ firebaseui-auth-container }}</div>
        <table>
            <tr><th>Email</th>
            <td><input type="email" id="email"></td></tr>
            <tr><th>Password</th>
            <td><input type="password" id="password"></td></tr>
            <tr><th></th><td>
                <button @click="flogin">{{ login }}</button>
                <button @click="flogout">{{ logout }}</button>
            </td></tr>
        </table>
    </div>
</template>

<script>
export default {
    name: "Loginbody",
    data() {
        return {
            msg
        }
    },
    methods: {
        flogin() {
            
        }
    }
}
</script>
