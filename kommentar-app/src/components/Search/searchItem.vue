<template>
    <!-- Basic Information of this Book -->
    <div class="allbox">

        <div class="box-card" :href="book.url">

            <!-- external link -->
            <a :href="'https://dx.doi.org/'+ book.doi"  target="_blank">DOI :{{book.doi}}</a>

            <!-- Titel -->
            <div>
                <h3 @click="seeDetail()">{{book.title}}</h3>
            </div>
        
            <!-- Author -->
            <p>Author: {{book.author}}</p>
            
        </div>
    </div>
</template>

<script>

    export default {
        props:["book"],

        data(){
            return{
                
            }
        },

        methods:{

            /**
             * open a new window which shows the details of this book
             */
            seeDetail(){
                // build router address
                let routeData = this.$router.resolve({
                    path: '/detail', 
                    query:{doi:this.book.doi},   
                });

                //open a new window
                window.open(routeData.href, "_blank");

            },   
        }
    }
</script>

<style>
.box-card{
    overflow: hidden;
    padding-top: 1vh;
}

.box-card a{
    text-decoration:none;
    font-size: 2.3vh;
    color:#76C06B;
}
.box-card a:hover{
    text-decoration: underline;
}
.box-card h3{
    margin: 1vh auto;
    font-size: 3vh;
    cursor: pointer;
    width:auto; 
    display:inline-block !important; 
}
.box-card h3:hover{
    text-decoration: underline;
}
.box-card p{
    margin-bottom: 3vh;
    font-size: 2vh;
}
</style>