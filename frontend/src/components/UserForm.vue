<template>
    <div>
        <Message :msg="msg" :msgClass="msgClass" />
        <form id="user-form" @submit="page === 'Register' ? register($event) : update($event)">
            <input type="hidden" name="id" id="id" v-model="id">
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
    import Message from './Message.vue'

    export default {
        name: "UserForm",
        data() {
            return {
                id: this.user._id || null,
                name: this.user.name || null,
                email: this.user.email || null,
                password: null,
                confirmPassword: null,
                btnText: "Register",
                msg: null,
                msgClass: null
            }
        },
        props: ["user", "page", "btnText"],
        components: {
            InputSubmit,
            Message
        },
        methods: {
            async register(e) {
                e.preventDefault();
                
                const data = {
                    name: this.name,
                    email: this.email,
                    password: this.password,
                    confirmpassword: this.confirmPassword
                }

                const jsondata = JSON.stringify(data);

                await fetch("http://localhost:3000/api/auth/register", {
                    method: "POST",
                    headers: { "content-type": "application/json" },
                    body: jsondata
                })
                .then((res) => res.json())
                .then((data) => {
                    let auth = false;

                    if(data.error) {
                        this.msg = data.error;
                        this.msgClass = "error";
                    } else {
                        auth = true;

                        this.msg = data.msg;
                        this.msgClass = "success";

                        this.$store.commit("authenticate", { token: data.token, userId: data.userId })
                    }

                    
                    setTimeout(() => {
                        if(!auth) {
                            this.msg = null;
                        } else {
                            this.$router.push("dashboard");
                        }
                    }, 2000)
                    

                })
                .catch((err) => {
                    console.log(err);
                })

            },

            async update(e) {
                e.preventDefault();

                const data = {
                    id: this.id,
                    name: this.name,
                    email: this.email,
                    password: this.password,
                    confirmpassword: this.confirmPassword
                }

                const jsondata = JSON.stringify(data);
                const token = this.$store.getters.token;

                await fetch("http://localhost:3000/api/user", {
                    method: "PATCH",
                    headers: {
                        "content-type": "application/json",
                        "auth-token": token
                    },
                    body: jsondata
                })
                .then((res) => res.json())
                .then((data) => {

                    if(data.error) {
                        this.msg = data.error;
                        this.msgClass = "error";
                    } else {
                        this.msg = data.msg;
                        this.msgClass = "success";
                    }

                    setTimeout(() => {
                        this.msg = null;
                    }, 2000)
                    

                })
                .catch((err) => {
                    console.log(err);
                })
            }
        }
    }
</script>

<style scoped>
    #user-form {
        max-width: 400px;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
    }

    .input-container {
        display: flex;
        flex-direction: column;
        margin-bottom: 15px;
        text-align: left;
    }

    .input-container label {
        margin-bottom: 10px;
        color: #555;
    }

    .input-container input {
        padding: 10px;
        border: 1px solid #e8e8e8;
    }

</style>