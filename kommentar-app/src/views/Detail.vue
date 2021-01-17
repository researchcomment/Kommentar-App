<template>
<div>
    <div class="maincontent" v-loading.fullscreen.lock="loading">
        <div class="detailpage">

            <bookInfo :doi="doi" @setDetail="setDetail" style="margin-bottom:5vh"></bookInfo>


            <!-- Ranking/Filter -->
            <div style="margin:0 10vw">
                <div @click="filterVisibility=!filterVisibility" class="commentfilter"><a-icon type="filter"/><h3>SORT COMMENTS BY</h3></div>
               
                <a-popover v-model="filterVisibility" placement="bottomLeft">
                    <template slot="content">
                        <div>
                            <a-checkbox v-model="filter" @change="getComments"> Only your own comments </a-checkbox>
                            <a-radio-group v-model="rank" :options="rankOptions" defaultValue="latest"  @change="getComments" />
                        </div>
                    </template>
                </a-popover>
            </div>

            <!-- Official Comments -->
            <div class="ocomment" >

                <!-- Title -->
                <h2 style="font-size: 1.5em; color: #76c06b">
                Official Comments
                <span style="color: #ababab; font-size: 0.8em">{{ Object.keys(officialCommentList).length }}</span>
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
                <h2 style="font-size:1.5em;color:#000">
                    Comments <span style="color:#ABABAB;font-size:0.8em">{{Object.keys(unofficialCommentList).length}}</span>
                </h2>
                
                <!-- List of unofficial Comments -->
                <ul class="ucommentli">
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
</div>
    
</template>

<script>
    import bookInfo from "@/components/detail/bookInfo";
    import comment from "@/components/detail/comment"
    import commentEditor from "@/components/detail/commentEditor";
    import firebase from 'firebase/app';

    export default {
        name:"detail",

        components:{
            bookInfo,
            commentEditor,
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
                    showLessItems:true,
                },
                paginationUnOfficial: {
                    pageSize: 5,
                    showLessItems:true,
                },

                filterVisibility:false,
                
                filter:false,

                rank:"latest",
                rankOptions:[
                    { label: 'Like', value: 'like' },
                    { label: 'Dislike', value: 'dislike' },
                    { label: 'Latest', value: 'latest' },
                    { label: 'History', value: 'history' }
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
             */
            async getComments() { 

                var rank = [this.rank];
                
                if(this.filter){
                    rank.push("onlyfromCurrentUser");
                }

                // open the loading-animation 
                this.loading = true;

                // send request
                this.$store.dispatch("commitwork/loadComments", 
                                                    {doi: this.doi, 
                                                     rankType:rank,    //  rankType:["like",...],
                                                     username: this.$store.state.account.username,
                                                     type:"official"})
                                            .then((result)=>{
                
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
                                                     rankType:rank,
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
.ocomment{
    margin: 2vh 10vw;
}
.ocomment .ocommentli{
    margin-bottom: 4vh;
    width: 70vw;
    padding-inline-start: 0;
}
.ucomment .ucommentli{
    margin-bottom: 4vh;
    width: 70vw;
}
.ucomment .ant-list-item{
    border: none;
    padding: 0;
    margin-bottom: 2vw;
}
.ocommentli .ant-list-item{
    border-bottom: none;
}
.ant-list-something-after-last-item .ant-spin-container > .ant-list-items > .ant-list-item:last-child{
    border-bottom: 0;
}
.ant-comment-inner{
    padding: 0;
}
.ant-comment-inner .ant-comment-content{
    border-bottom: 1px solid #EBEEF3;
}
.ant-comment-content-author .ant-comment-content-author-name a{
    font-size: 1em;
}
.ant-comment-content-author .ant-comment-content-author-time span{
    font-size: 1em;
}
.ant-comment-content-detail p{
    font-size: 1em;
    margin: 0;
}
.ant-comment-actions{
    margin: 0;
    padding: 0;
}
.ant-comment-inner{
    padding: 0;
}
.ant-comment-inner .ant-comment-avatar img{
    width: 4.5vw;
    height: 4.5vw;
    margin: 0;
}
.ant-comment-inner .ant-comment-avatar .ant-avatar{
    width: 4.5vw;
    height: 4.5vw;
}
.ant-comment-inner .ant-comment-avatar{
    margin-right: 3vw;
}
.ant-comment .ant-comment-actions .action{
    font-size: 0.8em;
}
.ant-comment-actions i swg{
    width: 0.8em;
    height: 0.8em;
}
.ant-list-pagination{
    margin-top: 0.8vw;
}
.commentfilter{
    cursor: pointer;
    color: #00243E;
    margin-bottom: 2vh;
    
}
.commentfilter h3{
    display: inline-block;
    font-size: 1em;
}
/* .commentfilter .anticon svg{
    height: 2vw;
    width: 2vw;
} */
.ant-pagination-item-active{
    border-color: #00243E;
}
.ant-pagination-item-active:hover{
    border-color: #00243E;
}
.ant-pagination-item-active a{
    color: #00243E;
}
.ant-pagination-item-active a:hover{
    color: #00243E;
}
</style>