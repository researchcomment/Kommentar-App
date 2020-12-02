<template>
    <div class="search-bar">

        <el-input 
        v-focus
        v-model="keyword" 
        placeholder="Search..." 
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
                keyword: this.search,
                from:new Date().getFullYear()-4, //string
                to:new Date().getFullYear(),
            }
        },
        methods:{
            doSearch() {   
                var sameSearch = (this.keyword == this.$route.query.keyword)&&
                                        (this.from == this.$route.query.from)&&
                                            (this.to == this.$route.query.to); 
                if (!this.keyword) {
                    this.$message.warning("Search cannot be empty");
                }
                else if(sameSearch){
                   return;  //待修改
                    //jump back to the first page
                } 
                else{
                    this.$router.push({path: '/search', 
                                       query: { keyword: this.keyword,
                                                from:this.from,
                                                to:this.to}});  //the form of to and from must be string
                     
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

/* .input-search{ 
    width:60%;
    height:46px;
} */

.el-input input{
    outline:none;
    border:solid 2px #00243E;
    box-sizing: border-box;
    font-size:1.2em;
    border-radius: 23px;
}
.el-input i{
    cursor: pointer;
}

.search-bar{
	margin:0 auto;
    width:60%;
}


</style>