<template>
    <div>
    <form action="" id="user-form">
        <div class="input-container">
            <label for="name">Name:</label>
            <input type="text" id="name" v-model="name" placeholder="Please enter your name:">
        </div>
        <div class="input-container">
            <label for="email">Name:</label>
            <input type="text" id="email" v-model="name" placeholder="Please enter your email:">
        </div>
        <div class="input-container">
            <label for="password">Name:</label>
            <input type="password" id="password" v-model="name" placeholder="Please enter your password:">
        </div>
        <div class="input-container">
            <label for="confirmPassword">Name:</label>
            <input type="password" id="confirmPassword" v-model="name" placeholder="Please confirm your password:">
        </div>
        <InputSubmit :text="btnText" />
    </form>
    </div>
</template>

<script>
    import InputSubmit from './form/InputSubmit.vue'

    export default {
        name: "UserForm",
        data() {
            return {
                name: null,
                email: null,
                password: null,
                confirmPassword: null,
                btnText: "Register"
            }
        },
        components: {
            InputSubmit
        }
    }
</script>

<style scoped>

</style>