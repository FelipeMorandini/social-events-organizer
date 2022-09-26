<template>
    <div>
        <Message :msg="msg" :msgClass="msgClass" />
        <form id="login-form" @submit="login($event)">
            <div class="input-container">
                <label for="email">E-Mail</label>
                <input type="email" name="email" v-model="email" id="email" placeholder="Enter your e-mail">
            </div>
            <div class="input-container">
                <label for="password">E-Mail</label>
                <input type="password" name="password" v-model="password" id="password" placeholder="Enter your password">
            </div>
            <InputSubmit text="Login" />
        </form>
    </div>
</template>

<script>
    import Message from './Message.vue'
    import InputSubmit from './form/InputSubmit.vue'

    export default {
        name: 'LoginForm',
        components: {
            Message,
            InputSubmit
        },
        data() {
            return {
                email: null,
                password: null,
                msg: null,
                msgClass: null
            }
        },
        methods: {
            async login(e) {
                e.preventDefault();

                const data = {
                    email: this.email,
                    password: this.password
                }

                const jsondata = JSON.stringify(data);

                await fetch('http://localhost:3000/api/auth/login', {
                    method: "POST",
                    headers: { "content-type": "application/json" },
                    body: jsondata
                })
                .then(res => res.json())
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

            }
            
        }
    }
</script>

<style scoped>
    #login-form {
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