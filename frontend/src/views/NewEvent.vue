<template>
    <div class="newevent">
      <h1>Home</h1>
      <EventForm :event="{}" page="newevent" btnText="Create event" />
    </div>
</template>
  
<script>
    import EventForm from "../components/EventForm.vue";
    
    export default {
        components: {
            EventForm
        }
    }
</script>

<style scoped>
    .newevent {
        text-align: center;
        padding-top: 40px;
        padding-bottom: 100px;
    }

    .newevent h1 {
        margin-bottom: 40px;
    }
    
</style>