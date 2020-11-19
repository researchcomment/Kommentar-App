<template>
    <div>

    </div>
</template>

<script>
   
    export default {
        
        mounted(){
            console.log(this.$store.dispatch('account/login',{
	            username:"123123",
                password:"123123123"
                }))
        }
    }
</script>

<style>

</style>