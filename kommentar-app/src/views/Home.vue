<template>
    <div>
<<<<<<< HEAD
       Home
=======
       this is Home Page
>>>>>>> 7484a6a18328b2afca1c07c5c3ed1f788e9be0e0
       <searchBar></searchBar>

    </div>
</template>

<script>
   import searchBar from '@/components/Search/searchBar'
    export default {
        components:{
            searchBar,

<<<<<<< HEAD
        },
=======
        }

        
>>>>>>> 7484a6a18328b2afca1c07c5c3ed1f788e9be0e0
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