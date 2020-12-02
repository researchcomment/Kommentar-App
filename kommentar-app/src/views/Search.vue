<template>
  <div v-loading.fullscreen.lock="loading">
    <!-- List search results -->
    <div>
        <img class="smalllogo" src="../../public/static/logo_small.png">
        <searchBar class="search-top-bar" :search="searchText"></searchBar>
    </div>
    

    <ul class="booklist" >
      <li>
        <div v-for="item in searchResultList" v-bind:key="item.id">
          <searchItem :book="item" />
        </div>
      </li>
      <div v-if="(searchResultList.length == 0) && (!loading)">Did not find any content!!</div>
    </ul>
    
    
  </div>
</template>

<script>
import searchBar from "@/components/Search/searchBar";
import searchItem from "@/components/Search/searchItem";
export default {
  name: "search",
  components: {
    searchBar,
    searchItem,
  },
  data() {
    return {
      searchResultList: [],
      loading:false,
    };
  },
  computed: {
    searchText() { 
      if (!this.$route.query.keyword) {
        this.$message.warning("Search cannot be empty");
      }
      return this.$route.query.keyword;
    },
    from(){
      return this.$route.query.from;
    },
    to(){
       return this.$route.query.to;
    }
  },
  created() {
     this.getSearchResult();
  },
  beforeRouteUpdate(to, from, next) {
    next();
    this.getSearchResult();
    
  },
  methods: {
    getSearchResult() {
      this.loading=true;

      //build the msg sent to backend
      var date = {
        from:new Date().setFullYear(this.from),
        to:new Date().setFullYear(this.to),
      }
      var info = { keyword: this.searchText,
                   date:date};
                   
      this.$store
        .dispatch("worklist/search", info )  
        .then((result) => {
          this.searchResultList = result.list;
        }).catch(err => {
        console.log(err);
        })
    },
  },
  watch:{
    searchResultList(newList,oldList){
      this.loading=false;
    }
  }
};
</script>

<style>
.search-top-bar{
    margin-left:20px;
    margin-right: auto;
    width:65%;
    margin-top: 15px;
    float:left;
}
.booklist{
    list-style-type: none;
    padding: 0;
    margin-top: 20px;
    float:left;
    width:60%;
    margin-left:30px;
}
.smalllogo{
    width:60px;
    height:60px;
    float: left;
    margin-left: 30px;
    vertical-align:middle;
    margin-top: 10px;
}
</style>