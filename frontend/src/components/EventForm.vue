<template>
    <div>
        <Message :msg="msg" :msgClass="msgClass" />
        <form action="" id="event-form" enctype="multipart/form-data" @submit="page === 'newevent' ? createEvent($event) : update($event)">
            <input type="hidden" id="id" name="id" v-model="id">
            <input type="hidden" id="userId" name="userId" v-model="userId">
            <div class="input-container">
                <label for="title">Event title:</label>
                <input type="text" id="title" name="title" v-model="title" placeholder="Enter the event title">
            </div>
            <div class="input-container">
                <label for="description">Event description:</label>
                <textarea id="description" name="description" v-model="description" placeholder="Enter the event description"></textarea>
            </div>
            <div class="input-container">
                <label for="eventDate">Event date:</label>
                <input type="date" id="eventDate" name="eventDate" v-model="eventDate">
            </div>
            <div class="input-container">
                <label for="photos">Photos:</label>
                <input type="file" multiple="multiple" id="photos" name="photos" ref="file" @change="onChange">
            </div>
            <div v-if="page === 'editevent' && showMiniImages" class="input-containe">
                <p>Saved images:</p>
                <img v-for="(photo, index) in photos" :src="`${photo}`" :key="index">
            </div>
            <div class="checkbox-container">
                <label for="private">Private event</label>
                <input type="checkbox" id="private" name="private" v-model="private">
            </div>
            <InputSubmit :text="btnText" />
        </form>
    </div>
</template>

<script>
    import Message from "./Message.vue"
    import InputSubmit from "./form/InputSubmit.vue";

    export default {
        name: "EventForm",
        data() {
            return {
                id: this.event._id || null,
                name: this.event.name || null,
                description: this.event.description || null,
                eventDate: this.event.eventDate || null,
                photos: this.event.photos || [],
                private: this.event.private || null,
                userId: this.event.userId || null,
                msg: null,
                msgClass: null,
                showMiniImages: true
            }
        },
        props: ["event", "page", "btnText"],
        components: {
            InputSubmit,
            Message
        },
        methods: {
            async createEvent(e) {
                e.preventDefault();

                const formData = new FormData();

                formData.append('title', this.title);
                formData.append('description', this.description);
                formData.append('eventDate', this.eventDate);
                formData.append('private', this.private);

                if(this.photos.length > 0) {
                    for(const i of Object.keys(this.photos)) {
                        formData.append('photos', this.photos[i])
                    }
                }

                const token = this.$store.getters.token

                await fetch("http://localhost:3000/api/event", {
                    method: "POST",
                    headers: {
                        "auth-token": token
                    },
                    body: formData
                })
                .then(res => res.json)
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
                        if(!data.error) {
                            this.$router.push('dashboard');
                        }
                    }, 2000)

                })
                .catch((err) => {
                    console.log(err)
                })

            },
            onChange(e) {
                this.photos = e.target.files;
                this.showMiniImages = false
            },
            async update(e) {
                e.preventDefault();

                const formData = new FormData();

                formData.append('id', this.id);
                formData.append('title', this.title);
                formData.append('description', this.description);
                formData.append('eventDate', this.eventDate);
                formData.append('private', this.private);
                formData.append('userId', this.userId);

                if(this.photos.length > 0) {
                    for(const i of Object.keys(this.photos)) {
                        formData.append('photos', this.photos[i])
                    }
                }

                const token = this.$store.getters.token

                await fetch("http://localhost:3000/api/event", {
                    method: "PATCH",
                    headers: {
                        "auth-token": token
                    },
                    body: formData
                })
                .then(res => res.json)
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
                    console.log(err)
                })
                
            }
        }
    }

</script>

<style scoped>
    #event-form {
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

    .input-container input,
    .input-container textarea {
        padding: 10px;
        border: 1px solid #e8e8e8;
    }

    .checkbox-container {
        flex-direction: row;
    }

    .checkbox-container input {
        margin-left: 12px;
        margin-top: 3px;
    }

    .mini-images {
        display: flex;
        flex-wrap: wrap;
        margin-bottom: 0px;
    }

    .mini-images p {
        width: 100%;
        font-weight: bold;
        margin-bottom: 15px;
        text-align: left;
    }

    .mini-images img {
        height: 50px;
        margin-right: 15px;
        margin-bottom: 15px;
    }

</style>