<template>
  <!-- List search results -->
  <div>
    <div class="maincontent">
      <div v-loading.fullscreen.lock="loading">
    
    <div>
        <searchBar ref="bar" class="search-top-bar" @gotoPage="gotoPage" ></searchBar>
    </div>
    
    
    <!-- Filterung -->
    <div class="filter"  v-show="!loading">
      <div>find {{resultLength}} results</div>
      <filterPopup 
        ref="filterPopup" 
        :filterCondition="filterCondition"
        @filter="filter"  ></filterPopup>
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
      <i class="iconfont icon-zuojiantou" v-show="page>1" @click="gotoPage(page-1,false)"></i>
      <p v-show="page-2>=1" @click="gotoPage(page-2,false)">{{page-2}}</p>
      <p v-show="page-1>=1" @click="gotoPage(page-1,false)">{{page-1}}</p>
      <p>{{page}}</p>
      <p v-show="(resultLength/10)>=(page+1)" @click="gotoPage(page+1,false)">{{page+1}}</p>
      <p v-show="(resultLength/10)>=(page+2)" @click="gotoPage(page+2,false)">{{page+2}}</p>
      <i class="iconfont icon-youjiantou" v-show="(!loading)" @click="gotoPage(page+1,false)"></i>
    </div>
  </div>
    <bottom></bottom>
  </div>
  
</template>

<script>
import searchBar from "@/components/Search/searchBar";
import searchItem from "@/components/Search/searchItem";
import bottom from '@/components/footer/bottom';
import filterPopup from "@/components/Search/filterPopup";

export default {
  name: "search",
  components: {
    searchBar,
    searchItem,
    bottom,
    filterPopup
  },
  data() {
    return {
      filterCondition:{
        date:{
            from:new Date(new Date().setFullYear(2019)),
            to:new Date(),
        },
        selectedType:["monograph","report","book","proceedings-article","journal","dissertation"],
      },
      searchResultList: [],
      page:1,  //the first page
      loading:false,
      resultLength:0,   
    };
  },
  computed: {
    searchText() { 
      return this.$route.query.keyword;
    },
  },
  created() {
    this.gotoPage(1,true);
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
        this.gotoPage(1,true); 
  },
  methods: {

    goHome(){
      this.$router.push('/')
    },
    
  /**
   * Re-search according to the filter conditions
   * @param newfilter  the filter date from FilterPopup-Component
   * */
    filter(newfilter){  
      this.filterCondition=newfilter;
      this.$refs.bar.keyword=this.$route.query.keyword;//do not search when the keyword is changed
      this.gotoPage(1,true);
    },


  /**change to the n. Page
   * @param n   the sequence of the new Page
   * @param newSearch   true if the search condition is changed
   */
    gotoPage(n,newSearch){
      if(n<=0){
        this.$message.warning("invalid Page number");
      }
      this.loading=true;
      this.page=n;  
      this.$store.dispatch("worklist/search", {
                                keyword:this.searchText,
                                    from:(this.page-1)*10,
                                          to:this.page*10,
                                            date:this.filterCondition.date,
                                              type:this.filterCondition.selectedType,
                                                flag:newSearch})   //flag = false , it is change page,not new search
        .then((result) => {
          this.searchResultList = result.list;
          this.resultLength=result.length;
          this.loading=false;
        }).catch(err => {
          console.log(err);
      })
      
    },
  },
  watch:{
    
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
    display: block;
    width:80%;
    font-size: 2.5vh;
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
/* .filter .fbtn{
  display: inline;
  margin-left: 1%;
  color: #76C06B;
  cursor: pointer;
} */
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
  display: block;
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