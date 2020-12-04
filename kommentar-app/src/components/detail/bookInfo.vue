<template>
    <div>
        <p>Title:{{detail.title}}</p>
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

<style lang="scss" scoped>

</style>