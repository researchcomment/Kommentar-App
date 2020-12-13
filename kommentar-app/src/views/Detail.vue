<template>
<div>
    <div class="maincontent">
        <div class="detailpage">
        <bookInfo :doi="doi"></bookInfo>
        <officialComment :doi="doi" :username="username"></officialComment>
        <unofficialComment :doi="doi" :username="username"></unofficialComment>
        <commentEditor :doi="doi" :username="username" @submit="refresh"></commentEditor>
    </div>
    <bottom></bottom>
    </div>
</div>
    
</template>

<script>
import bookInfo from "@/components/detail/bookInfo";
import officialComment from "@/components/detail/officialComment";
import unofficialComment from "@/components/detail/unofficialComment";
import commentEditor from "@/components/detail/commentEditor";
import bottom from '@/components/footer/bottom';
import firebase from 'firebase/app';
    export default {
        name:"detail",
        components:{
            bookInfo,
            officialComment,
            unofficialComment,
            commentEditor,
            bottom
        },
        data(){
            return{
            }
        },
        computed:{
            doi(){
                return this.$route.query.doi;
            },
            username: function () {
                //console.log(firebase.auth().currentUser.uid)
                return this.$store.state.account.username;
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
            },
            refresh(){
                this.$router.go(0);
            }
        }
        
    }
</script>

<style>
.bot{
    margin: auto 0;
    width: 100%;
}

</style>