<template>
    <div>
       this is Home Page
       <searchBar></searchBar>

    </div>
</template>

<script>
   import searchBar from '@/components/Search/searchBar'
    export default {
        components:{
            searchBar,

        }

        
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