<template>
    <div class="details">
        <div v-loading.fullscreen.lock="loading">
            <h2>
                {{detail.title}}
            </h2> 
            <div>
                <div v-for="(item, key) in detail" :key="key">
                <img src="../../../public/static/book.jpg" align="right"  v-if="item == 'book-chapter'" class="workimg">
                <img src="../../../public/static/journal-article.jpg" align="right"  v-if="item == 'journal-article'" class="workimg">
                <img src="../../../public/static/proceeding.jpg" align="right"  v-if="item == 'proceedings'" class="workimg">
                <img src="../../../public/static/dissertations.jpg" align="right"  v-if="item == 'dissertations'" class="workimg">
                <img src="../../../public/static/components.jpg" align="right"  v-if="item == 'component'" class="workimg">
                <p v-if=" key=='type'">
                    {{key}}: {{item}}
                </p>
                
            </div>
            </div>
            <div v-for="(item, key) in detail" :key="key">
                <p v-if="(key!='title')&&(item!=null)&&(item[0]!=null)&&(key!='type')">
                    {{key}}: {{item}}
                </p>
                
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