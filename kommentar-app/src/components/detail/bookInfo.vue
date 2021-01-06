<template>
    <div class="details">
        <div v-loading.fullscreen.lock="loading">

            <!-- Book Cover -->
            <div v-for="(item, index) in detail" v-bind:key="index">
                <img src="../../pics/book.jpg" align="right"  v-if="item == 'book'" class="workimg">
                <img src="../../pics/journal-article.jpg" align="right"  v-if="item == 'journal'" class="workimg">
                <img src="../../pics/proceeding.jpg" align="right"  v-if="item == 'proceedings-article'" class="workimg">
                <img src="../../pics/dissertations.jpg" align="right"  v-if="item == 'dissertation'" class="workimg">
                <img src="../../pics/components.jpg" align="right"  v-if="item == 'component'" class="workimg">  
            </div>

            <!-- Titel -->
            <h2 style="font-size:3vw">
                {{detail.title}}
            </h2>
            
            <!-- Detail  -->
            <div>
             
                <p style="font-size:1.8vw">
                    type: {{detail.type}}
                </p>
                <div v-for="(item, key) in detail" v-bind:key="key">
                <p v-if="(key!='title')&&(item)&&(key!='type')&&(key!='abstract')" style="font-size:1.8vw">
                    {{key}}: {{item}}
                </p>
                </div>

                <div v-if="detail.abstract" v-html="detail.abstract">
                </div>
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

            // open the loading-animation 
            this.loading=true;

            // get book detail from db
            this.$store.dispatch("commitwork/askfordetail", {
                                    doi:this.doi,
                                    username:this.username,})    
                .then((result) => {
                    this.detail = result;
                    this.loading=false;    // close the loading-animation 
                    this.$emit("setDetail",this.detail)
                }).catch(err => {
                    console.log(err);
            })

        }
    }
</script>

<style>
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
        height: 20vw;
        top: 0vh;
        padding: 3vw;
        padding-right: 0;
    }
</style>