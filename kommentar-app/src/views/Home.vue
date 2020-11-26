<template>
    <div class="search">
       <div class="logo"><img src="../../public/static/logo.jpg" alt=""></div>
       <searchBar class="searchbar"></searchBar>

    </div>
</template>

<script>
   import searchBar from '@/components/Search/searchBar'
    export default {
        name: 'home',
        components:{
            searchBar,

        },
        mounted(){
    
        }
    }
</script>

<style>
    .search{
        position: relative;
        height: 400px;
        top: 30px;
    }
    
    .search img{
        width:20%;
        height:20%;
    }
    .logo{
        margin: 0 auto;
        text-align: center;
    }

</style>