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
        props:["from","to"],
        data() {
            return {
                keyword:"",
            }
        },
        methods:{
            doSearch() {   
                if (!this.keyword) {
                    this.$message.warning("Search cannot be empty");
                }
                var sameSearch = (this.keyword == this.$route.query.keyword)&&
                                        (this.from == this.$route.query.from)&&
                                            (this.to == this.$route.query.to); 
               
                if(sameSearch){
                    //jump back to the first page
                   this.$emit("gotoPage",0);
                   //return;  //待修改
                   
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
.filter p{
    margin-bottom:0;
}

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