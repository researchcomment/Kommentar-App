<template>
<div>
    <div class="maincontent">
        
        <div class="search">

            <!-- Logo -->
            <div class="logo"><img src="../pics/logo1.png" alt=""></div>

            <!-- Search Bar -->
            <searchBar class="searchbar"></searchBar>
            
        </div>

    </div>
    

</div>
    
    
</template>

<script>
   import searchBar from '@/components/Search/searchBar'

    export default {
        name: 'home',

        components:{
            searchBar

        },

        mounted(){

        },

    }
</script>

<style>
    .search{
        position: relative;
        height: 400px;
        top: 30px;
    }
    
    .search img{
        width:70vw;
        margin: 0 15vw;
    }
    .logo{
        margin: 0 auto;
        text-align: center;
    }
    .searchbar{
        width: 65vw;
        margin: 3vh auto;
    }
    .maincontent{
        min-height: calc(100vh - 12vh);
    }

</style>