<template>
    <div class="search-bar">
        
        
       
        <el-input 
        v-focus
        v-model="searchText" 
        placeholder="" 
        class="input-search"
        @keydown.enter.native="doSearch"
        clearable
        > 
            <i slot="prefix" class="el-input__icon el-icon-search"  @click="doSearch"></i>
        </el-input>

      
            
           
    
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
    width:85%;
    height:46px;
}

.el-input input{
    outline:none;
    border:solid 2px #00243E;
    box-sizing: border-box;
    font-size:1.2em;
    border-radius: 23px;
}


.search-bar{
	margin:0 auto;
    width:80%;
}

</style>