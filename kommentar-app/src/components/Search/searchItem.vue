<template>
    <!-- Basic Information of this Book -->
    <div class="box-card"
        :href="book.url">
        <a href="http://www.google.com">DOI :{{book.doi}}</a>
        <h3>{{book.title}}</h3>
        <p>Author: {{book.author}}</p>
            
    </div>

   
</template>

<script>
    export default {
        props:["book"]
    }
</script>

<style>
.box-card{
    border-bottom: 2px solid #EBEBEB;
    overflow: hidden;
    padding-bottom: 5%;
    padding-top: 5%;
}

.box-card a{
    margin-top: 5%;
    text-decoration:none;
    font-size: 100%;
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