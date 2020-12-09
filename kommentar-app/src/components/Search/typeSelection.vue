<template>
    <div>
        <mt-checklist
        title="Type"
        v-model="selectedType1"
        :options= "options1">
        </mt-checklist>
        <mt-button @click.native="moreType=!moreType" >~more Types~</mt-button>
        
        <div  v-show="moreType">
            <mt-checklist
            title="Type"
            v-model="selectedType2"
            :options= "options2">
            </mt-checklist>
        </div>
            
        


        
    </div>
</template>

<script>
    export default {
        data(){
            return{
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
        computed:{
            list(){
                var list =this.selectedType1;
                for(var i in this.selectedType2){
                        list.push(this.selectedType2[i]);
                }
            }
        },
       watch:{
            /**
             * Submit the typelist
             */
            list(){
                this.$emit("setTypeList",list);
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>