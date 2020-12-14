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
        data() {
            return {
                keyword:this.$route.query.keyword,
            }
        },
        methods:{
            /**do a search request and refresh the search page */
            doSearch() {   
                if (!this.keyword) {
                    this.$message.warning("Search cannot be empty");
                    return;
                }

                this.$router.push({path: '/search', 
                                    query: {keyword : this.keyword,
                                            }});                
                         
            },
        },
        directives: {
            focus: {
                inserted: function (el) {
                    el.focus()
                }
            }
        },
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
    font-size:2vh;
    border-radius: 23px;
    height: 4.7vh;
}
.el-input i{
    cursor: pointer;
    line-height: 200%;
}



</style>