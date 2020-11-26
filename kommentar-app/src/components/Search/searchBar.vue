<template>
    <div>
       <input 
        v-focus
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
    width:50%;
    height:46px;
    border:solid 2px #00243E;
    box-sizing: border-box;
    vertical-align: bottom;
    font-size:1.2em;
    padding-left:20px;
    border-radius: 23px;
    position: absolute;
    left: 0;
	right: 0;
	margin:0 auto;
}


</style>