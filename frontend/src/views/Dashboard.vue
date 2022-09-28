<template>
    <div class="dashboard">
        <div class="title-container">
            <h1>Your events:</h1>
            <router-link to="/newevent">New event</router-link>
        </div>
        <div v-if="events.length > 0">
            <DataTable :events="events"/>
        </div>
        <div v-else>
            <p>You don't have any events. Click <router-link to="/newevent">here</router-link> to create your first event.</p>
        </div>
    </div>
</template>

<script>
    import DataTable from '../components/DataTable.vue'

    export default {
        data() {
            return {
                events: []
            }
        },
        components: {
            DataTable
        },
        created() {
            this.getEvents();
        },
        methods: {
            async getEvents() {
                const token = this.$store.getters.token;

                await fetch('http://localhost:3000/api/event/userEvents', {
                    method: "GET",
                    headers: {
                        "Content-type": "application/json",
                        "auth-token": token
                    }
                })
                .then(res => res.json)
                .then((data) => {
                    this.events = data.events;
                })
                .catch((err) => {
                    console.log(err);
                })
            }
        }
    }
</script>

<style scoped>
    .dashboard {
        padding: 50px;
        padding-bottom: 100px;
    }

    .title-container {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 40px;
    }

    .btn {
        padding: 10px 16px;
        background-color: #000;
        color: #FFF;
        margin: 5px;
        text-decoration: none;
        border: none;
        cursor: pointer;
        font-size: 14px;
        transition: .5s;
    }

</style>