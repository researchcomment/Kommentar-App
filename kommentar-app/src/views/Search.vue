<template>
    <div>
        <!-- List search results -->
        <searchBar :search="searchText" ></searchBar>
        
        <div v-for="item in searchResultList" v-bind:key="item.id">
            <searchItem :info="item"/>
        </div>
        
        <div v-if="searchResultList.length==0">
            Did not find any content!!
        </div>
    </div>
</template>

<script>
 import searchBar from '@/components/Search/searchBar'
 import searchItem from '@/components/Search/searchItem'
    export default {
        name: 'search',
        components:{
            searchBar,
            searchItem,
        },
        data(){
            return {
                searchResultList:[],
            }
        },
        computed:{
            searchText(){
                return this.$route.params.searchText;
            },
            
        },
        beforeRouteUpdate(to, from, next){
            next();
            this.getSearchResult();
        },
        methods:{
            getSearchResult(){
                this.searchResultList = this.$store.dispatch('worklist/search',this.searchText).list;
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>