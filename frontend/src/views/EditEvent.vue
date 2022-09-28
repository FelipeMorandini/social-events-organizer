<template>
    <div class="editevent">
        <h1>Edit Event:</h1>
        <EventForm :event="event" page="editevent" btnText="Edit event" :key="componentKey" />
    </div>
</template>

<script>
    import EventForm from '@/components/EventForm.vue';
    
    export default {
        components: {
            EventForm
        },
        data() {
            return {
                event: {},
                componentKey: 0
            }
        },
        created() {
            this.getEvent();
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
                    this.event = data.event;
                    this.event.eventDate = this.event.eventDate.substring(0, 10);

                    this.event.photos.forEach((photo, index) => {
                        this.event.photos[index] = photo.replace("public", "http://localhost:3000");
                    });

                    this.componentKey += 1;

                })
                .catch((err) => {
                    console.log(err);
                })
            }
        }
    }
</script>

<style scoped>
    .editevent {
        text-align: center;
        padding-top: 40px;
        padding-bottom: 100px;
    }

    .editevent h1 {
        margin-bottom: 40px;
    }
</style>