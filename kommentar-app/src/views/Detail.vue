<template>
<div>
    <div class="maincontent" v-loading.fullscreen.lock="loading">
        <div class="detailpage">

            <bookInfo :doi="doi" @setDetail="setDetail"></bookInfo>

            <!-- Ranking -->
            <a-icon type="filter"/>
            <a-checkbox-group v-model="rank" name="Ranking" :options="rankOptions" @change="getComments"/>


            <!-- Official Comments -->
            <div class="ocomment" >

                <!-- Title -->
                <h2 style="font-size: 2.5vw; color: #76c06b">
                Official Comments
                <span style="color: #ababab; font-size: 1.5vw">{{ Object.keys(officialCommentList).length }}</span>
                </h2>

                <!-- List of official Comments -->
                <ul class="ocommentli">
                    <a-list item-layout="vertical" size="large" :pagination="paginationOfficial" :data-source="officialCommentList">   
                        <a-list-item slot="renderItem" slot-scope="comment" >
                            <comment :commentFromParent="comment" :username="username"  @refresh="getComments"/>
                        </a-list-item>
                    </a-list>
                </ul>

            </div>

             <!-- Unofficial Comments -->
            <div class="ucomment">

                <!-- Title -->
                <h2 style="font-size:2vw;color:#000">
                    Comments <span style="color:#ABABAB;font-size:1.5vw">{{Object.keys(unofficialCommentList).length}}</span>
                </h2>
                
                <!-- List of unofficial Comments -->
                <ul class="ucommitli">
                    <a-list item-layout="vertical" size="large" :pagination="paginationUnOfficial" :data-source="unofficialCommentList">   
                        <a-list-item slot="renderItem" slot-scope="comment" >
                            <comment :commentFromParent="comment" :username="username"  @refresh="getComments"/>

                        </a-list-item>
                    </a-list>
                </ul>

            </div>   

            <commentEditor :doi="doi" :username="username" :title="detail.title" @submit="refresh"></commentEditor>

        </div>
    </div>
    <div>
    <bottom></bottom>
    </div>
</div>
    
</template>

<script>
    import bookInfo from "@/components/detail/bookInfo";
    import comment from "@/components/detail/comment"
    import commentEditor from "@/components/detail/commentEditor";
    import bottom from '@/components/footer/bottom';
    import firebase from 'firebase/app';

    export default {
        name:"detail",

        components:{
            bookInfo,
            commentEditor,
            bottom,
            comment,
        },

        data(){
            return{
                officialCommentList: [],
                unofficialCommentList: [],
                loading: false,
                detail:{},
                paginationOfficial: {
                    pageSize: 5,
                },
                paginationUnOfficial: {
                    pageSize: 5,
                },
                rank:[],
                rankOptions:[
                    { label: 'Only your own comments', value: 'onlyfromCurrentUser' },
                    { label: 'History', value: 'history' },
                    ],
            }
        },

        created() {
            this.getComments();
        },

        beforeRouteUpdate(to, from, next) {
            next();
            this.getComments();
        },

        computed:{
            
            doi(){
                return this.$route.query.doi;
            },

            username: function () {
                return this.$store.state.account.username;
            },

        },


        methods:{ 

            /**
             * Request comment content from the backend
             * 
             */
            async getComments() {    
            
                // open the loading-animation 
                this.loading = true;

                // send request
                this.$store.dispatch("commitwork/loadComments", 
                                                    {doi: this.doi, 
                                                     rankType:this.rank,    //  rankType:"time",
                                                     username: this.$store.state.account.username,
                                                     type:"official"})
                                            .then((result)=>{
                                               console.log(result)
                                               this.officialCommentList= Object.keys(result).map((key) => {
                                                                            var comment = result[key];
                                                                            comment.key=key;
                                                                            return comment;
                                                                        })
                                                     })
                                            .catch(err => {
                                                            console.log(err);
                                                         });

               this.$store.dispatch("commitwork/loadComments", 
                                                    {doi: this.doi, 
                                                     rankType:this.rank,
                                                     username: this.$store.state.account.username,
                                                     type:"unofficial"})
                                            .then((result)=>{
                                               
                                               this.unofficialCommentList= Object.keys(result).map((key) => {
                                                                            var comment = result[key];
                                                                            comment.key=key;
                                                                            return comment;
                                                                        })
                                                     })
                                            .catch(err => {
                                                            console.log(err);
                                                         });

                // close the loading-animation 
                this.loading = false;

            },

            /**
             * reload the page by submit from editor
             */
            refresh(){
                this.$router.go(0);
            },

            setDetail(detail){
                this.detail =detail;
            }
        },
        
    }
</script>

<style>

.ucomment ul{
    list-style-type: none;
    padding: 1vw;
}
.ucomment{
    margin: 2vh 10vw;
}
.ucomment .ucommitli{
    margin-bottom: 4vh;
    width: 70vw;
}
.ant-comment-inner{
    padding: 0;
}
.ant-comment-inner .ant-comment-content{
    border-bottom: 1px solid #EBEEF3;
}
.ant-comment-content-author .ant-comment-content-author-name a{
    font-size: 1.5vw;
}
.ant-comment-content-detail p{
    font-size: 1.5vw;
    margin-bottom: 0;
}
.ant-comment-actions{
    margin: 0;
    padding: 0;
}
.ant-comment-actions span{
    font-size: 2vw;
}
.ucomment .ant-comment-inner{
    padding: 0;
}
.ucomment .ant-comment-inner .ant-comment-avatar img{
    width: 4.5vw;
    height: 4.5vw;
    margin: 0;
}
.ucomment .ant-comment-inner .ant-comment-avatar .ant-avatar{
    width: 4.5vw;
    height: 4.5vw;
}
.ucomment .ant-comment-inner .ant-comment-avatar{
    margin-right: 3vw;
}
.ucomment .ant-comment-actions{
    margin-bottom: 4vh;
    padding: 0;
}
.ucomment .ant-comment .ant-comment-actions span span{
    font-size: 1.2vw;
}
.ucomment .ant-comment-actions i swg{
    width: 1.2vw;
    height: 1.2vw;
}
.ucomment .ant-comment-content-detail p{
    margin-bottom: 1vh;
}

</style>