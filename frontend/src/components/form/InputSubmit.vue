<template>
    <input type="submit" :value="text">
</template>

<script>
    export default {
        name: "InputSubmit",
        props: {
            text: ""
        }
    }
</script>

<style scoped>

</style>