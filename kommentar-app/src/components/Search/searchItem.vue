<template>
    <div>
        <!-- Basic Information of this Book -->
        <el-card class="box-card"
            :href="book.url">
            <p>Title: {{book.title}}</p>
            <p>Author: {{book.author}}</p>
            <p>DOI :{{book.doi}}</p>
        </el-card>

    </div>
</template>

<script>
    export default {
        props:["book"]
    }
</script>

<style>

</style>