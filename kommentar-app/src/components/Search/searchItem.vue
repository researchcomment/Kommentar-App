<template>
    <!-- Basic Information of this Book -->
    <div class="allbox">
        <div class="box-card"
        :href="book.url"
        @click="seeDetail()">
        <a @click="searchOutside">DOI :{{book.doi}}</a>
        <h3 >{{book.title}}</h3>
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
                var url="https://care.diabetesjournals.org/search/"+ this.book.doi;
                window.open(url, "_blank");
            }
        }
    }
</script>

<style>
.box-card{
    border-bottom: 2px solid #EBEBEB;
    overflow: hidden;
    padding-bottom: 5%;
    padding-top: 5%;
    cursor: pointer;
}
.allbox :hover{
    background: #F2F2F2;
}

.box-card a{
    margin-top: 5%;
    text-decoration:none;
    font-size: 100%;
    color:#76C06B;
    cursor: pointer;
}
.box-card a:link {color:#76C06B}      /* 未访问链接*/
.box-card a:visited {color:#76C06B}  /* 已访问链接 */

.box-card h3{
    margin: 2% auto;
    font-size: 100%;
}
.box-card p{
    margin: 0 auto;
    font-size: 100%;
}
</style>