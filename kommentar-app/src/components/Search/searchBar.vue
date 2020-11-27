<template>
    <div class="search">
        <i @click="doSearch" class="iconfont icon-sousuo"></i>
       <input 
        v-focus
        v-model="searchText" 
        placeholder="" 
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
        },
        directives: {
            focus: {
                inserted: function (el) {
                    el.focus()
                }
            }
    }
    }
</script>

<style>
.input-search{
    outline:none;
    width:85%;
    height:46px;
    border:solid 2px #00243E;
    box-sizing: border-box;
    vertical-align: bottom;
    font-size:1.2em;
    padding-left:20px;
    border-radius: 23px;
    float: left;
    position: absolute;
    left: 0;
	right: 0;
    margin:0 46px;
}
.search i{
    height:46px;
    width: 46px;
    font-size: 250%;
    margin-left: 5%;
    margin-right: 0;
    margin-left: auto;
    float: left;
    cursor: pointer;
}
.search{
    width:80%;
    left: 0;
	right: 0;
	margin:0 auto;
}

</style>