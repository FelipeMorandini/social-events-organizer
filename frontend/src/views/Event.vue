<template>
    <div class="event">
        <h1>{{ event.name }}</h1>
        <div class="event-container">
            <div class="event-images" v-if="event.photos">
                <div class="main-image" :style="{'background-image': 'url(' + event.photos[0] + ')'}"></div>
                <div class="event-mini-images" v-if="event.photos[1]">
                    <div class="mini-image" v-for="(photos, index) in event.photos.slice(1, event.photos.length)" :key="index" :style="{'background-image': 'url(' + event.photos[index+1] + ')'}"></div>
                </div>
            </div>
            <div class="event-details">
                <p class="bold">Description:</p>
                <p class="event-description">{{ event.description }}</p>
                <p class="bold">Date:</p>
                <p class="event-date">{{ event.date }}</p>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                event: {}
            }
        },
        created() {
            this.getEvent()
        },
        methods: {
            async getEvent() {
                const id = this.$route.params.id;
                const token = this.$store.getters.token;

                await fetch(`http://localhost:3000/api/event/${id}`, {
                    method: "GET",
                    headers: {
                        "Content-type": "application/json",
                        "auth-token": token
                    }
                })
                .then(res => res.json())
                .then((data) => {

                    if(data.error != null) {
                        this.$router.push('home');
                    }

                    this.event = data.event;
                    this.event.eventDate - new Date(this.event.eventDate).toLocaleDateString();

                    this.event.photos.forEach((photo, index) => {
                        this.event.photos[index] = photo.replace("public", "http://localhost:3000").replaceAll('\\', "/");
                    })
                })
                .catch((err) => {
                    console.log(err);
                })
            }
        }
    }
</script>

<style scoped>
    .event {
        text-align: center;
        padding-top: 40px;
        padding-bottom: 100px;
        width: 1000px;
        margin: 0 auto;
    }

    .event h1 {
        margin-bottom: 40px;
    }

    .event-container {
        display: flex;
    }

    .event-images {
        width: 300px;
        margin-right: 30px;
    }

    .main-image {
        width: 100%;
        height: 200px;
        background-color: #CCC;
        margin-bottom: 15px;
        background-position: center;
        background-size: cover;
    }

    .event-mini-images {
        display: flex;
        flex-wrap: wrap;
    }

    .main-image {
        width: 80px;
        height: 80px;
        margin-right: 15px;
        margin-bottom: 15px;
        background-color: #CCC;
        background-position: center;
        background-size: cover;
    }

    .event-details {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
    }

    .bold {
        margin-bottom: 12px;
        font-weight: bold;
    }

    .event-description, .event-date {
        margin-bottom: 20px;
    }

</style>