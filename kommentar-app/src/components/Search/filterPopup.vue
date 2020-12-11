<template>
    <div>
        <!-- filter icon -->
        <div class="fbtn">
          <i @click="filterDialog=true" class="iconfont icon-filter" size="small"></i>
        </div>

        <mt-popup
          v-model="filterDialog"
          position="right"
          closeOnClickModal="false"
          class="filterpopup"
        >
            <!-- date Picker -->
            <div style="width: 20vh">
              From
              <mt-button @click.native="open('datepickerFrom')" size="normal">
                {{filterCondition.date.from.getFullYear()}}-{{filterCondition.date.from.getMonth()+1}}
              </mt-button>
            </div>
            <div style="width: 20vh">
                To
              <mt-button @click.native="open('datepickerTo')" size="normal">
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
            <mt-button @click.native="moreType=!moreType">  ~more Types~  </mt-button>
            <div  v-show="moreType">
                <mt-checklist
                title="Type"
                v-model="selectedType2"
                :options= "options2">
                </mt-checklist>
            </div>
 
          <!-- Submit Buttons -->
          <mt-button @click.native="confirm" size="large" type="primary">Confirm</mt-button>
          <mt-button @click.native="filterDialog=false" size="large" type="primary">Cancel</mt-button>
        </mt-popup>
        <mt-datetime-picker
          ref="datepickerFrom"
          type="date"
          v-model="filterCondition.date.from"
          year-format="{value}"
          month-format="{value}"
          :startDate="defaultdate.from"
          :endDate="filterCondition.date.to"
        >
        </mt-datetime-picker>
        <mt-datetime-picker
          ref="datepickerTo"
          type="date"
          v-model="filterCondition.date.to"
          year-format="{value}"
          month-format="{value}"
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
  height:100vh;
  overflow:auto;
  background-color: #fff;
}
.mint-popup{
  overflow:auto;
}

</style>