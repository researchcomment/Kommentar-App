<template>
    <div>
        <p>{{doi}}</p>
        <bookInfo></bookInfo>
        <officialComment></officialComment>
        <unofficialComment></unofficialComment>
        <commentEditor></commentEditor>
    </div>
</template>

<script>
import bookInfo from "@/components/detail/bookInfo";
import officialComment from "@/components/detail/officialComment";
import unofficialComment from "@/components/detail/unofficialComment";
import commentEditor from "@/components/detail/commentEditor";
    export default {
        name:"detail",
        components:{
            bookInfo,
            officialComment,
            unofficialComment,
            commentEditor,
        },
        data(){
            return{

            }
        },
        computed:{
            doi(){
                return this.$route.query.doi;
            },

        },
        created() {
            this.getDetailfromDB();
        },
        beforeRouteUpdate(to, from, next) {
            next();
            this.getDetailfromDB();
    
        },
        methods:{
            getDetailfromDB(){
                //get Details: book information and commentars from backends
            }
        }
        
    }
</script>

<style>

</style>