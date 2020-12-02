<template>
  <!-- List search results -->
  <div v-loading.fullscreen.lock="loading">
    
    <div>
        <img class="smalllogo" @click="goHome" src="../../public/static/logo_small.png">
        <searchBar class="search-top-bar" :from="from" :to="to" @gotoPage="gotoPage" ></searchBar>
    </div>
    
    <!-- Filterung -->
    <div class="filter" v-if= "!loading">
      <p v-show='filterflag'>find 1,000,000 results</p>
      <div class="filterselct" v-show='!filterflag'>
        <el-select class="timeselect" v-model="value" placeholder="Date" size="mini">
        <el-option class="timeoption"
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      </div>

      <button @click="showfilter" class="fbtn" size="small">filter</button>
    </div>

    <!-- show the results -->
    <ul class="booklist" >
      <li>
        <div v-for="item in searchResultList" v-bind:key="item.id" >
          <searchItem :book="item" />
        </div>
      </li>
      <div v-if="(searchResultList.length == 0) && (!loading)">Did not find any content!!</div>
    </ul>
    
    <!-- change Pages -->
    <button v-show="(!loading)&&(page>1)" @click="gotoPage(page-1)">last Page</button>
    <p>{{page}}</p>
    <button v-show="(!loading)" @click="gotoPage(page+1)">next Page</button>
    
    
    
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
      from:new Date().getFullYear()-5, //string e.g. 2015
      to:new Date().getFullYear(),
      searchResultList: [],
      page:1,  //the first page
      loading:false,
      filterflag:true,
      value:1,
      options: [{
          value: '1',
          label: 'last year'
        }, {
          value: '2',
          label: 'last month'
        }, {
          value: '3',
          label: 'last week'
        }],
    };
  },
  computed: {
    searchText() { 
      if (!this.$route.query.keyword) {
        this.$message.warning("Search cannot be empty");
      }
      return this.$route.query.keyword;
    },
  },
  created() {
     this.getSearchResult();
  },
  beforeRouteUpdate(to, from, next) {
    next();
    this.getSearchResult();
    
  },
  methods: {
    goHome(){
      this.$router.push('/')
    },
    //ask data base for top 10 relevant books
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
    showfilter: function () {
        this.filterflag = !this.filterflag;
    },

    //goto the n. Page, 1 is the first page
    gotoPage(n){
      if(n<=0){
        this.$message.warning("invalid Page number");
      }
      this.page=n;
      this.$store
        .dispatch("worklist/changepage", {from:(this.page-1)*10+1,
                                          to:(this.page-1)*10+11} )  
        .then((result) => {
          this.searchResultList = result.list;
        }).catch(err => {
        console.log(err);
      })
    },
    
    
   
    showfilter: function () {
        this.filterflag = !this.filterflag;
    }
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
    margin-left:2%;
    margin-right: auto;
    width:65%;
    margin-top: 15px;
    display: inline-block;
}
.booklist{
    list-style-type: none;
    padding: 0;
    margin-left:10%;
    margin-right: 5%;
    margin-top: 0;
    display: bolck;
    width:60%;
}
.smalllogo{
    width:5%;
    height:5%;
    display: inline-block;
    margin-left: 2%;
    vertical-align:middle;
    margin-top: 2%;
}
.filter{
  display: block;
  margin-left:10%;
  width: 60%;
  line-height: 200%;
  margin-top: 1%;
}
.filter p{
  display: inline;
  
}
.filter .fbtn{
  display: inline;
  float: right;
}
.filterselct{
  display: inline;
}
.timeselect{
  width: 30%;
}
.timeoption{
}
</style>