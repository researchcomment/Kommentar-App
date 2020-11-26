<template>
    <div>
       <input 
        v-model="searchText" 
        placeholder="Search..." 
        class="input-search"  
        @keydown.enter="doSearch">  
       
    </div>
</template>

<script>
    export default {
        props:["search"],
        data() {
            return {
                searchText: this.search
            }
        },
        methods:{
            doSearch() {           
                if (!this.searchText) {
                    this.$message.warning("Search cannot be empty");
                } 
                else{
                    this.$router.push(`/search/${this.searchText}`)  
                }
                     
            },
        }
    }
</script>

<style>
.input-search{
    outline:none;
    width:100%;
    height:46px;
    border:solid 1px #3388FF;
    box-sizing: border-box;
    vertical-align: bottom;
    font-size:1.2em;
    padding:20px 20px;
    border-radius: 23px;
}


</style>