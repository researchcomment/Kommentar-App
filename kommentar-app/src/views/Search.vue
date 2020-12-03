<template>
  <!-- List search results -->
  <div v-loading.fullscreen.lock="loading">
    
    <div>
        <img class="smalllogo" @click="goHome" src="../../public/static/logo_small.png">
        <searchBar ref="bar" class="search-top-bar" :from="dateString.from" :to="dateString.to"  @gotoPage="gotoPage" ></searchBar>
    </div>
    
    <!-- Filterung -->
    <div class="filter" v-if= "!loading">
      <p v-show='filterflag'>find {{resultLength}} results</p>
      <div class="filterselct" v-show='!filterflag'>
        <!-- from<input type="text" placeholder="year" v-model="from"> to <input type="text" placeholder="year" v-model="to"> -->
        <!-- <button @click="getupdateresult">go</button> -->
        <mt-button @click.native="open('datepickerFrom')" size="large">
          From  {{dateString.from}}
        </mt-button>
        <mt-button @click.native="open('datepickerTo')" size="large">To {{dateString.to}}</mt-button>
        <mt-datetime-picker
          ref="datepickerFrom"
          type="date"
          v-model="date.from"
          year-format="{value}"
          month-format="{value}"
          date-format="{value}"
         >
        </mt-datetime-picker>
        <mt-datetime-picker
          ref="datepickerTo"
          type="date"
          v-model="date.to"
          year-format="{value}"
          month-format="{value}"
          date-format="{value}"
         >
        </mt-datetime-picker>
      </div>
      <div class="fbtn">
         <i @click="showfilter" class="iconfont icon-guolv-copy" size="small"></i>
      </div>
     
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
    <div class="pagesetter" v-if= "!loading">
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
      date:{
          from:new Date(new Date().setFullYear(2019)),
          to:new Date(),
      },
      searchResultList: [],
      page:1,  //the first page
      loading:false,
      filterflag:true,
      resultLength:0,
    };
  },
  computed: {
    searchText() { 
      return this.$route.query.keyword;
    },
    dateString(){
      var y=this.date.from.getFullYear();  
      var m=this.date.from.getMonth()+1;  
      m=m < 10 ? ('0' + m) : m;  
      var d =this.date.from.getDate();  
      d = d < 10 ? ('0' + d) : d;   
      var datefrom = y + '-' + m + '-' + d; 
      
      var y=this.date.to.getFullYear();  
      var m=this.date.to.getMonth()+1;  
      m = m < 10 ? ('0' + m) : m;  
      var d=this.date.to.getDate();  
      d = d< 10 ? ('0' + d) : d;   
      var dateto=y + '-' + m + '-' + d;
      return {from:datefrom,
              to:dateto};
    }
  },
  created() {
    this.getSearchResult();
  },
  beforeRouteEnter (to, from, next) {
    // called before the route that renders this component is confirmed.
    // does NOT have access to `this` component instance,
    // because it has not been created yet when this guard is called!
    next(vm => {
      if (!vm.$route.query.keyword)
        next('/');
    // access to component instance via `vm`
    })
  },
  beforeRouteUpdate(to, from, next) {
    if (!to.$route.query.keyword)
      next('/')
    else{
      next();
      this.getSearchResult();
    }
  },
  methods: {
    //set the date in query as this.date
    updateDate(){
      var from=new Date(new Date().setFullYear(2019));
      var to=new Date();
      if(this.$route.query.from){
        from=this.changeToDate(this.$route.query.from);
      }
      if(this.$route.query.to){
        to=this.changeToDate(this.$route.query.to);
      }
      this.date = {from:from,
                   to:to,}
    },
    changeToDate(str){
      var year=str.substring(0,4);
      var month=str.substring(5,7);
      var day=str.substring(8,10);
      var date = new Date();
      date.setDate(day);
      date.setMonth(month-1);
      date.setFullYear(year);
      return date;
    },
    open(picker) {
        this.$refs[picker].open();
    },

    goHome(){
      this.$router.push('/')
    },
    //ask data base for top 10 relevant books
    getSearchResult() {
      //if (!this.searchText) return;
      this.loading=true;
      this.updateDate();
      //build the msg sent to backend
      var info = { keyword: this.searchText,
                   date:this.date};                   
      this.$store
        .dispatch("worklist/search", info)  
        .then((result) => {
          this.searchResultList = result.list;
          this.resultLength=result.length;
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
      this.loading=true;
      this.page=n;
      this.$store
        .dispatch("worklist/search", {
                                keyword:this.searchText,
                                    from:(this.page-1)*10,
                                          to:this.page*10,
                                            date:this.date})  
        .then((result) => {
          this.searchResultList = result.list;
        }).catch(err => {
        console.log(err);
      })
    },
    
    showfilter: function () {
      this.filterflag = !this.filterflag;
    },
    // getupdateresult(){
    //   this.$refs.bar.doSearch();
    // }


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
    vertical-align: middle;
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
  cursor: pointer;
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
  height: 50%;
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
  margin-bottom: 2%;
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
</style>