<template>
    <div class="search">
       <div class="logo"><img src="../../public/static/logo1.png" alt=""></div>
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
        width:50%;
        height:50%;
        margin-bottom: 30px;
    }
    .logo{
        margin: 0 auto;
        text-align: center;
    }
    /* .searchbar{
        width: 55%;
        height:46px;
        margin:0 auto;
    } */

</style>