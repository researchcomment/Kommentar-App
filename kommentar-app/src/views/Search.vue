<template>
  <!-- List search results -->
  <div>
    <div class="maincontent">
      <div v-loading.fullscreen.lock="loading">
    
    <div>
        <searchBar ref="bar" class="search-top-bar" :from="dateString.from" :to="dateString.to"  @gotoPage="gotoPage" ></searchBar>
    </div>
    
    <!-- Filterung -->
    <div class="filter" v-if= "!loading">
      <div v-show='filterflag'>find {{resultLength}} results
        <div class="fbtn">
          <i @click="showfilter" class="iconfont icon-filter" size="small"></i>
        </div>
      </div>
      <div class="filterselct" v-show='!filterflag'>
        <!-- from<input type="text" placeholder="year" v-model="from"> to <input type="text" placeholder="year" v-model="to"> -->
        <!-- <button @click="getupdateresult">go</button> -->
        <div style="display:inline-block;width: 20vh">
          <span>From</span><mt-button @click.native="open('datepickerFrom')" size="normal">
         {{dateString.from}}
        </mt-button>
        </div>
        <div style="display:inline-block;width: 20vh">
          <span>To</span><mt-button @click.native="open('datepickerTo')" size="normal">{{dateString.to}}</mt-button>
        </div>
        
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
        <div class="fbtn">
          <i @click="showfilter" class="iconfont icon-filter-full" size="small"></i>
        </div>
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
    <bottom></bottom>
  </div>
  
</template>

<script>
import searchBar from "@/components/Search/searchBar";
import searchItem from "@/components/Search/searchItem";
import bottom from '@/components/footer/bottom'

function changeDatetoString(date){
  let datestring=date.getFullYear()+"-"
    +((date.getMonth()+1)<10?"0":"")+(date.getMonth()+1)+
    "-"+(date.getDate()<10?"0":"")+date.getDate();
  return datestring;
}
export default {
  name: "search",
  components: {
    searchBar,
    searchItem,
    bottom
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
      var datefrom = changeDatetoString(this.date.from);   
      var dateto=changeDatetoString(this.date.to);
      return {from:datefrom,
              to:dateto};
    }
  },
  created() {
    this.gotoPage(1);
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      if (!vm.$route.query.keyword)
        next('/');
    })
  },
  beforeRouteUpdate(to, from, next) {
      next();
      if (!this.$route.query.keyword)
        next('/');
      else
        this.gotoPage(1);
   
  },
  methods: {
    //set the date in query as this.date
    updateDate(){
      var from=new Date(new Date().setFullYear(new Date().getFullYear-1));
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
      date.setDate(day).setMonth(month-1).setFullYear(year);
      return date;
    },
    open(picker) {
        this.$refs[picker].open();
    },

    goHome(){
      this.$router.push('/')
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
          this.resultLength=result.length;
        }).catch(err => {
        console.log(err);
      })
    },
    
    showfilter: function () {
      this.filterflag = !this.filterflag;
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
    margin-left:10%;
    margin-right: auto;
    width:80%;
    margin-top: 2vh;
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
.filter{
  display: block;
  margin-left:10%;
  width: 60%;
  line-height: 200%;
  margin-top: 2vh;
  height: 50%;
  font-size: 1.8vh;
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
.filterselct span{
  display: inline-block;
  width: 5vh;
  font-size: 2vh;
}
.filterselct .mint-button{
  width: 14vh;
  height: 3vh;
  line-height: 3vh;
}
.filterselct label{
  font-size: 2vh;
  
}
.filterselct input{
  width:10%;
  
}
.filterselct button{
  margin-left: 1%;
  margin-right: 2%;
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