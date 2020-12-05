<template>
<div>
    <div class="maincontent">
        <div class="search">
       <div class="logo"><img src="../../public/static/logo1.png" alt=""></div>
       <searchBar class="searchbar"></searchBar>
    </div>
    </div>
    <bottom></bottom>
</div>
    
    
</template>

<script>
   import searchBar from '@/components/Search/searchBar'
   import bottom from '@/components/footer/bottom'
import Bottom from '../components/footer/bottom.vue'
    export default {
        name: 'home',
        components:{
            searchBar,bottom

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
        min-height: calc(100vh - 5vh);
    }

</style>