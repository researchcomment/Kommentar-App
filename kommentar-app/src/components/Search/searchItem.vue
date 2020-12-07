<template>
    <!-- Basic Information of this Book -->
    <div class="allbox">
        <div class="box-card"
        :href="book.url"
        >
        <a @click="searchOutside">DOI :{{book.doi}}</a>

        <div>
            <h3 @click="seeDetail()">{{book.title}}</h3>
        </div>
        
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
            //open a new window which shows the details of this book
            seeDetail(){
                let routeData = this.$router.resolve({
                    path: '/detail', 
                    query:{doi:this.book.doi},   
                });
                window.open(routeData.href, "_blank");
            },
            searchOutside(){
                var url="https://dx.doi.org/"+ this.book.doi;
                window.open(url, "_blank");
            }
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
    font-size: 100%;
    color:#76C06B;
}
.box-card a:hover{
    text-decoration: underline;
    color: #76C06B;
    }
.box-card a:link {color:#76C06B}      /* 未访问链接*/
.box-card a:visited {color:#76C06B}  /* 已访问链接 */

.box-card h3{
    margin: 1vh auto;
    font-size: 100%;
    cursor: pointer;
     width:auto; 
     display:inline-block !important; 
     display:inline;
}
.box-card h3:hover{
    cursor: pointer;
    text-decoration: underline;
}
.box-card p{
    margin-bottom: 2vh;
    font-size: 100%;
}
</style>