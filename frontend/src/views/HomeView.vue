<template>
  <div class="home">
    <h1>Latest events:</h1>
    <div class="events-container">
      <div class="event-container" v-for="(event, index) in events" :key="index">
        <div class="event-img" :style="{'background-image': 'url(' + event.photos[0] + ')'}"></div>
        <router-link :to="`/event/${event._id}`" class="event-title">{{ event.name }}</router-link>
        <p class="event-date">Date: {{ event.eventDate }}</p>
        <router-link :to="`/event/${event._id}`" class="event-details-btn">Details</router-link>
      </div>  
    </div>
    <p v-if="events.length === 0">No events to show...</p>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        events: []
      }
    },
    created() {
      this.getEvents();
    },
    methods: {
      async getEvents() {
        await fetch("http://localhost:3000/api/event/all", {
          method: "GET",
          headers: {
            "Content-type": "application/json"
          }
        })
        .then(res => res.json())
        .then((data) => {

          data.events.forEach((event, index) => {
            
            if(event.eventDate) {
              event.eventDate = new Date(event.eventDate).toLocaleString();
            }

            if(event.photos,length > 0) {
              event.photos.forEach((photo, index) => {
                event.photos[index] = photo.replace("public", "http://localhost:3000")
              })
            }

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

  .home {
    padding-top: 40px;
    padding-bottom: 100px;
    text-align: center;
  }

  .home h1 {
    margin-bottom: 40px;
  }

  .events-container {
    display: flex;
    flex-wrap: wrap;
    max-width: 1000px;
    margin: 0 auto;
  }

  .event-container {
    width: 30.3%;
    margin: 1.5%;
    display: flex;
    flex-direction: column;
  }

  .event-img {
    width: 100%;
    height: 200px;
    background-color: #CCC;
    margin-bottom: 12px;
    background-position: center;
    background-size: cover;
  }

  .event-title {
    color: #25282E;
    text-decoration: none;
    margin-bottom: 12px;
  }

  .event-date {
    color: #777;
    margin-bottom: 12px;
  }

  .event-details-btn {
    width: 100%;
    text-transform: uppercase;
    color: #FFF;
    background-color: #25282E;
    transition: .5s;
    border: 0;
    padding: 12px;
    text-decoration: none;
    text-align: center;
  }

  .event-details-btn:hover {
    background-color: #141619;
  }

</style>
