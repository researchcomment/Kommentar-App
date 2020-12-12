<template>
    <div>
        <!-- filter icon -->
        <div class="fbtn">
          <i @click="filterDialog=true" class="iconfont icon-filter" size="small"></i>
        </div>

        <mt-popup
          v-model="filterDialog"
          closeOnClickModal="false"
          class="filterpopup"
        >
          <div style="margin:3vh">
            <div>
              <!-- date Picker -->
              <div class="fromto">
                From
              </div>
              <mt-button @click.native="open('datepickerFrom')" size="normal" style="cursor:pointer">
                {{filterCondition.date.from.getFullYear()}}-{{filterCondition.date.from.getMonth()+1}}
              </mt-button>
            </div>
            <div>
                <div class="fromto">
                To
              </div>
              <mt-button @click.native="open('datepickerTo')" size="normal" style="cursor:pointer">
                {{filterCondition.date.to.getFullYear()}}-{{filterCondition.date.to.getMonth()+1}}
              </mt-button>
            </div>
            
            <!-- Type List 1 -->
            <mt-checklist
            title="Type"
            v-model="selectedType1"
            :options= "options1">
            </mt-checklist>
            
             <!-- Type List 2 -->
            <mt-button @click.native="moreType=!moreType" class="morebtn">~more Types~</mt-button>
            <div  v-show="moreType">
                <mt-checklist
                title="Type"
                v-model="selectedType2"
                :options= "options2">
                </mt-checklist>
            </div>

          <div>
            <mt-button class="comfirmbtn" style="margin-right:2vh" @click.native="confirm" size="large" type="primary">Confirm</mt-button>
            <mt-button class="comfirmbtn" @click.native="filterDialog=false" size="large" type="default">Cancel</mt-button>
          
          </div>
          <!-- Submit Buttons -->
         </div>
            
            
        </mt-popup>
        <mt-datetime-picker
          ref="datepickerFrom"
          type="date"
          v-model="filterCondition.date.from"
          :startDate="defaultdate.from"
          :endDate="filterCondition.date.to"
        >
        </mt-datetime-picker>
        <mt-datetime-picker
          ref="datepickerTo"
          type="date"
          v-model="filterCondition.date.to"
          :startDate="filterCondition.date.from"
          :endDate="defaultdate.to"
        >
        </mt-datetime-picker>
       
    </div>
</template>

<script>
    export default {
        data(){
            return{
                filterDialog:false,
                filterCondition:{
                                  date:{
                                      from:new Date(new Date().setFullYear(2019)),
                                      to:new Date(),
                                  },
                                  selectedType:["monograph","report","book","proceedings-article","journal","dissertation"],
                                },
                defaultdate:{
                    from:new Date(new Date().setFullYear(1968)),
                    to:new Date()
                },
                moreType:false,
                options1:["monograph","report","book","proceedings-article","journal","dissertation"],
                options2:["book-section","peer-review","book-track","journal-article","book-part",
                            "other","journal-volume","book-set","reference-entry","component","book-chapter",
                            "proceedings-series","report-series","proceedings","standard","reference-book",
                            "posted-content","journal-issue","dataset","book-series","edited-book","standard-series"],
                selectedType1:["monograph","report","book","proceedings-article","journal","dissertation"],
                selectedType2:[],
            }
        },
        methods:{
            /** open the date picker*/
            open(picker) {
                this.$refs[picker].open();
                var pickerSlot = document.getElementsByClassName('picker-slot');
                pickerSlot[2].style.display = 'none'
                pickerSlot[5].style.display = 'none'
            },
            
            /** Submit filter data */
            confirm(){
                this.filterDialog=false;
                this.filterCondition.selectedType =this.selectedType1;
                for(var i in this.selectedType2){
                        this.filterCondition.selectedType.push(this.selectedType2[i]);
                }
                this.$emit("filter",this.filterCondition);
            },
            updateFliter(newFliter){
              this.filterCondition=newFliter
              console.log("【Filter】"+this.filterCondition.date.from)
            }
        },

    }
</script>

<style>
.fbtn{
  display: inline;
  margin-left: 1%;
  color: #76C06B;
  cursor: pointer;
}
.filterpopup{
  height:50vh;
  width: 70vw;
  overflow:auto;
  background-color: #fff;
}
.mint-popup{
  overflow:auto;
}
.fromto{
  display: inline-block;
  width: 7vh;
  font-size: 2.5vh;
  color: black;
}
.mint-popup .mint-checklist .mint-checklist-title{
  margin: 2vh 0;
  font-size: 2.5vh;
  color: black;
}
.mint-popup .mint-checklist .mint-cell{
  background-image: none;
}
.mint-popup .mint-checklist .mint-cell .mint-cell-wrapper .mint-cell-value{
  display: none;
  cursor: default;
}
.mint-popup .mint-checklist .mint-cell .mint-cell-wrapper{
  padding: 0 1vh;
  cursor: default;
}
.mint-popup .mint-checklist .mint-cell .mint-cell-wrapper .mint-cell-title .mint-checklist-label{
  padding: 0;
}
.mint-popup .mint-checklist .mint-cell .mint-cell-wrapper .mint-cell-title .mint-checklist-label .mint-checkbox-core{
  width:2vh;
  height: 2vh;
}
.mint-popup .mint-checklist .mint-cell .mint-cell-wrapper .mint-cell-title .mint-checklist-label .mint-checkbox-label{
  word-break: break-all;
}
.morebtn{
  width: 18vh;
  height: 2vh;
  margin-bottom: 3vh;
  cursor: pointer;
}
.morebtn .mint-button-text{
  font-size: 2vh;
  white-space: pre;
}
.filterpopup .comfirmbtn{
  width: 10vh;
  display: inline-block;
  height: 5vh;
  cursor: pointer;
}
.filterpopup .comfirmbtn .mint-button-text{
  font-size: 2vh;
  
}
</style>