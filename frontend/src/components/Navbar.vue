<template>
    <div id="nav">
        <router-link to="/" id="logo-container">
            <img src="/img/socialeventslogo.png" alt="Social Events">
        </router-link>
        <h2 id="nav-title">Social Events</h2>
        <div id="nav-links">
            <router-link to="/">Home</router-link>
            <router-link to="/login" v-show="!authenticated">Sign In</router-link>
            <router-link to="/register" v-show="!authenticated">Sign Up</router-link>
            <router-link to="/dashboard" v-show="authenticated">Sign In</router-link>
            <router-link to="/profile" v-show="authenticated">My Profile</router-link>
            <button @click="logout($event)" v-show="authenticated">Logout</button>
        </div>
    </div>
</template>

<script>
    import { mapState } from 'vuex'

    export default {
        name: "Navbar",
        methods: {
            logout(e) {
                e.preventDefault();
                this.$store.commit("logout");
                this.$router.push('/');
            }
        },
        computed: {
            ...mapState([
                'authenticated'
            ])
        }
    }
</script>

<style scoped>
    #nav {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 20px;
        border-bottom: 1px solid #EEE;
    }

    #nav a {
        text-decoration: none;
        margin-right: 15px;
    }

    #nav img {
        width: 35px;
    }

    #nav-title {
        font-size: 3rem;
        font-weight: 300;
    }

    #logo-container, #nav-links {
        width: 400px;
    }

    #nav-links {
        display: flex;
        justify-content: flex-end;
    }

    button {
        background-color: #EEE;
        border: none;
        font-size: 16px;
        cursor: pointer;
    }

    button:hover {
        color: #C1B696;
    }

</style>