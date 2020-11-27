<template>
    <div>
        <!-- Basic Information of this Book -->
        <div class="box-card"
            :href="book.url">
            <p>Title: {{book.title}}</p>
            <p>Author: {{book.author}}</p>
            <p>DOI :{{book.doi}}</p>
        </div>

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
}
</style>