<template>
    <div class="details">
        <div v-loading.fullscreen.lock="loading">
            <h2>
                {{detail.title}}
            </h2> 
            <div>
                <img src="../../../public/static/book.jpg" align="right"  v-if="detail.type == 'book-chapter'" class="workimg">
                <img src="../../../public/static/journal-article.jpg" align="right"  v-if="detail.type == 'journal'" class="workimg">
                <img src="../../../public/static/proceeding.jpg" align="right"  v-if="detail.type == 'proceedings'" class="workimg">
                <img src="../../../public/static/dissertations.jpg" align="right"  v-if="detail.type == 'dissertations'" class="workimg">
                <img src="../../../public/static/components.jpg" align="right"  v-if="detail.type == 'component'" class="workimg">
                <h3>
                    type: {{detail.type}}
                </h3>
            </div>
            <div v-for="(item, key) in detail" v-bind:key="key">
                <p v-if="(key!='title')&&(item)&&(key!='type')&&(key!='abstract')">
                    {{key}}: {{item}}
                </p>
            </div>
            <div id="abstract">
            </div>
     
           
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
                    
                    var template = document.getElementById('abstract');
                    this.detail.abstract = this.detail.abstract.trim(); // Never return a text node of whitespace as the result
                    template.innerHTML = this.detail.abstract;
                    this.loading=false;
                }).catch(err => {
                    console.log(err);
            })
        }
    }
</script>

<style>
    .details h2{
        font-size: 4vh;
    }
     .details h3{
        font-size: 3vh;
    }
    .details p{
        font-size: 2.5vh;
    }
    .details{
        margin-top: 5vh;
        margin-left: 10vw;
        margin-right: 10vw;
        margin-bottom: 1vh;
    }
    .details{
        word-break: break-all;
    }
    .workimg{
        width: 40vw;
        top: 0vh;
        padding: 2vh;
        padding-right: 0;
    }
</style>