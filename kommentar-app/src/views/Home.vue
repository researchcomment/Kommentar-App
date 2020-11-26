<template>
    <div class="search">
       <div class="logo">Logo</div>
       <searchBar></searchBar>

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
        width: 800px;
        height: 100px;
        position: absolute;
        left: 50%;
        top: 50%;
        margin-top: -50px;
        margin-left: -400px;
        border: 1px solid blue;
        
    }
    .logo{
        margin: 0 auto;
        text-align: center;
        font-size: 50px;
    }

</style>