<template>
  <!-- List search results -->
  <div v-loading.fullscreen.lock="loading">
    
    <div>
        <searchBar ref="bar" class="search-top-bar" :from="from" :to="to" @gotoPage="gotoPage" ></searchBar>
    </div>
    
    <!-- Filterung -->
    <div class="filter" v-if= "!loading">

      <div v-show='filterflag'>find 1,000,000 results
        <div class="fbtn">
          <i @click="showfilter" class="iconfont icon-filter" size="small"></i>
        </div>
      </div>

      <div class="filterselct" v-show='!filterflag'>
        from<input type="text" placeholder="year" v-model="from"> to <input type="text" placeholder="year" v-model="to">
        <button @click="getupdateresult">go</button>
        <div class="fbtn">
          <i @click="showfilter" class="iconfont icon-filter-full" size="small"></i>
        </div>
      </div>
      
     
    </div>

    <!-- show the results -->
    <ul class="booklist" >
      <li>
        <div v-for="item in searchResultList" v-bind:key="item.id" >
          <searchItem :book="item" />
        </div>
      </li>
      
    </ul>
    <div v-if="(searchResultList.length == 0) && (!loading)"><img class="sorryimg" src="../../public/static/sorry.png" alt=""></div>
    <!-- change Pages -->
    <div class="pagesetter" v-if= "(!loading)&&(searchResultList.length != 0)">
      <i class="iconfont icon-zuojiantou" v-show="(!loading)&&(page>1)" @click="gotoPage(page-1)"></i>
      <p>{{page}}</p>
      <i class="iconfont icon-youjiantou" v-show="(!loading)" @click="gotoPage(page+1)"></i>
    </div>
    
    
    
    
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
    },
    getupdateresult(){
      this.$refs.bar.doSearch();
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
    margin-left:10%;
    margin-right: auto;
    width:80%;
    margin-top: 15px;
    display: block;
}
.booklist{
    list-style-type: none;
    padding: 0;
    margin-left:10%;
    margin-right: 3vw;
    margin-top: 0;
    display: bolck;
    width:80%;
    font-size: 1.5vw;
}
/* .smalllogo{
  cursor: pointer;
    width:5%;
    height:5%;
    display: inline-block;
    margin-left: 2%;
    vertical-align:middle;
    margin-top: 2%;
} */
.filter{
  display: block;
  margin-left:10%;
  width: 60%;
  line-height: 200%;
  margin-top: 1vh;
  height: 50%;
  font-size: 1.2vw;
}
.filter p{
  display: inline;
  
}
.filter .fbtn{
  display: inline;
  margin-left: 1%;
  color: #76C06B;
  cursor: pointer;
}
.filterselct{
  display: inline;
}
.filterselct input{
  width:10%;
  
}
.filterselct button{
  margin-left: 1%;
}
.timeselect{
  width: 30%;
}
.pagesetter{
  display: bolck;
  margin-left:8%;
  margin: 2vh;
}
.pagesetter i{
  display: inline;
  font-size: 120%;
  color: #76C06B;
  cursor: pointer;
}
.pagesetter p{
  display: inline;
  margin: 0 3%;
  font-size: 120%;
}
.sorryimg{
  width: 40vw;
  margin: 0 30vw;
}
</style>