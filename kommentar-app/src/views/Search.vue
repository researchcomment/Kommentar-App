<template>
  <!-- List search results -->
  <div>
    <div class="maincontent">
      <div v-loading.fullscreen.lock="loading">
    
    <div>
        <searchBar ref="bar" class="search-top-bar" @gotoPage="gotoPage" ></searchBar>
    </div>
    
    <!-- Filterung -->
    <div class="filter" v-if= "!loading">
      <div >find {{resultLength}} results
        <div class="fbtn">
          <i @click="filterDialog=true" class="iconfont icon-filter" size="small"></i>
        </div>
      </div>

        <mt-popup
          v-model="filterDialog"
          position="right"
          closeOnClickModal="false"
          class="filterpopup"
        >
         
            <div style="width: 20vh">
              From
              <mt-button @click.native="open('datepickerFrom')" size="normal">
                {{date.from.getFullYear()}}-{{date.from.getMonth()+1}}
              </mt-button>
            </div>
            <div style="width: 20vh">
              To
              <mt-button @click.native="open('datepickerTo')" size="normal">
                {{date.to.getFullYear()}}-{{date.to.getMonth()+1}}
              </mt-button>
            </div>
        
          
          
          <typeSelection  @setTypeList="setTypeList($event)"></typeSelection>
          <mt-button @click.native="filter" size="large" type="primary">Confirm</mt-button>
          <mt-button @click.native="filterDialog=false" size="large" type="primary">Cancel</mt-button>
        </mt-popup>
        <mt-datetime-picker
            ref="datepickerFrom"
            type="date"
            v-model="date.from"
            year-format="{value}"
            month-format="{value}"
            :startDate="defaultdate.from"
            :endDate="date.to"
            @cancel="close('datepickerFrom')"
            @confirm="close('datepickerFrom')"
           
          >
          </mt-datetime-picker>
          <mt-datetime-picker
            ref="datepickerTo"
            type="date"
            v-model="date.to"
            year-format="{value}"
            month-format="{value}"
            :startDate="date.from"
            :endDate="defaultdate.to"
            @cancel="close('datepickerTo')"
            @confirm="close('datepickerTo')"
          >
          </mt-datetime-picker>
        
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
      <i class="iconfont icon-zuojiantou" v-show="(!loading)&&(page>1)" @click="gotoPage(page-1,false)"></i>
      <p>{{page}}</p>
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
import typeSelection from "@/components/Search/typeSelection";

export default {
  name: "search",
  components: {
    searchBar,
    searchItem,
    bottom,
    typeSelection
  },
  data() {
    return {
      date:{
        from:new Date(new Date().setFullYear(2019)),
        to:new Date(),
      },
      oldDate:{
        from:new Date(new Date().setFullYear(2019)),
        to:new Date(),
      },
      defaultdate:{
        from:new Date(new Date().setFullYear(1968)),
        to:new Date()
      },
      oldSelectedType:["monograph","report","book","proceedings-article","journal","dissertation"],
      selectedType:["monograph","report","book","proceedings-article","journal","dissertation"],
      searchResultList: [],
      page:1,  //the first page
      loading:false,
      filterDialog:false,
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

    /**
     * !BUG delete the day option of only one date picker
     * open the date picker
     */
    open(picker) {
      this.$refs[picker].open();
      var pickerSlot = document.getElementsByClassName('picker-slot');
      pickerSlot[2].style.display = 'none'
      pickerSlot[5].style.display = 'none'
      
    },
    close(picker){
      this.$refs[picker].close();
      console.log(34);
    },

    goHome(){
      this.$router.push('/')
    },
    
  /**Re-search according to whether the filter conditions are changed*/
    filter(){
      this.filterDialog =false;
      var sameFilterCondition = (this.oldDate.from==this.date.from)&&
                                (this.oldDate.to==this.date.to)&&
                                (this.selectedType=this.oldSelectedType);
      if(!sameFilterCondition){
        this.gotoPage(1,true);
      }
    },
    setTypeList(list){
      this.selectedType=list;
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
      this.oldDate = this.date;
      this.oldSelectedType=this.selectedType;
      this.$store
        .dispatch("worklist/search", {
                                keyword:this.searchText,
                                    from:(this.page-1)*10,
                                          to:this.page*10,
                                            date:this.date,
                                              type:this.selectedType,
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

.filterpopup{
  height:100vh;
  overflow:auto;

  background-color: #fff;
}
</style>