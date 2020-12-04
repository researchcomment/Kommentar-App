<template>
    <div class="details">
        <h2>{{detail.title}}</h2>
        <p>Author:{{detail.author}}</p>
        <p>Editor:{{detail.editor}}</p>
        <p>Chair:{{detail.chair}}</p>
        <p>Translator:{{detail.translator}}</p>
        <p>Contributor:{{detail.contributor}}</p>
        <p>Bibliographic:{{detail.bibliographic}}</p>
        <p>Affiliation:{{detail.affiliation}}</p>
        <p>DOI:{{detail.doi}}</p>
    </div>
</template>

<script>
    export default {
        props:["doi","username"],
        data(){
            return{
                detail:[],
            }
        },
        computed:{
        },
        mounted(){
            this.$store.dispatch("commitwork/askfordetail", {
                                    doi:this.doi,
                                    username:this.username,})    
                .then((result) => {
                    this.detail = result;
                    }).catch(err => {
                    console.log(err);
            })
        }
    }
</script>

<style>
    .details h2{
        font-size: 5vh;
    }
    .details p{
        font-size: 3vh;
    }
    .details{
        margin-top: 5vh;
        margin-left: 10vw;
        margin-right: 10vw;
        margin-bottom: 1vh;
    }
</style>