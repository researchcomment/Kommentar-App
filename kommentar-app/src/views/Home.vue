<template>
<div>
    <div class="maincontent">
        
        <div class="search">

            <!-- Logo -->
            <div class="logo">
                <img src="../pics/logo_small.jpg" alt="">
                <div style="display:inline-block;vertical-align: middle">
                    <h3>Comment</h3>
                    <h3>of Works</h3>
                    <h4>let ideas fly</h4>
                </div>
                
                </div>

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
        width:30vw;
        display:inline-block;
        vertical-align: middle;
    }
    .logo{
        margin: 0 auto;
        text-align: center;
    }
    .logo h3{
        font-size: 6vw;
        color: #00243E;
        margin-bottom: -0.3em;
    }
    .logo h4{
        font-size: 3vw;
        color: #76C06B;
        margin-top: 0.3em;
    }
    .searchbar{
        width: 65vw;
        margin: 2vh auto;
    }
    .maincontent{
        min-height: calc(100vh - 12vh);
    }

</style>