<template>
    <div class="details">
        <div v-loading.fullscreen.lock="loading">
            <h2>{{detail.title}}</h2> 
            <h3>Type:{{detail.type}}</h3>
            <p>Container-title:{{detail.string}}</p>
            <p>Author:{{detail.author}}</p>
            <p>Publischer:{{detail.publisher}}</p>
            <p>Created:{{new Date(detail.created)}}</p>
            <p>Published-Print:{{new Date(detail.published-print)}}</p>
            <p>Deposited:{{new Date(detail.deposited)}}</p>
            <p>URL:{{detail.URL}}</p>
        </div>
    </div>
</template>

<script>
    export default {
        props:["doi","username"],
        data(){
            return{
                detail:[],
                loading:false,
            }
        },
        computed:{
        },
        mounted(){
            this.loading=true;
            this.$store.dispatch("commitwork/askfordetail", {
                                    doi:this.doi,
                                    username:this.username,})    
                .then((result) => {
                    this.detail = result;
                    this.loading=false;
                }).catch(err => {
                    console.log(err);
            })
        }
    }
</script>

<style>
    .details h2{
        font-size: 6vh;
    }
     .details h3{
        font-size: 5vh;
    }
    .details p{
        font-size: 4vh;
    }
    .details{
        margin-top: 5vh;
        margin-left: 10vw;
        margin-right: 10vw;
        margin-bottom: 1vh;
    }
</style>