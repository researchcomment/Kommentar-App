<template>
    <div class="ucomment" v-loading.fullscreen.lock="loading">

        <!-- Title -->
        <h2 style="font-size:2vw;color:#000">
            Comments <span style="color:#ABABAB;font-size:1.5vw">{{uncomnum}}</span>
        </h2>
        
        <!-- List of official Comments -->
        <ul>
            <li v-for="item in commentList" v-bind:key="item.id" class="ucommitli">
                <div>
                    <comment :commentFromParent="item"  :username="username" @refresh="getComments"/>
                </div>
            </li>
        </ul>

    </div>   
</template>

<script>
import comment from "./comment"

export default {
    props:["doi","username"],

    components:{
        comment,
    },

    data(){
        return {
            commentList:[],
            loading:false,
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
        uncomnum: function(){
            return this.commentList.length
        }
    },

    methods:{
 
        //后端提供方法:loadUnOfficialComments, rankType
        //输入需要 doi
        //返回所有对于给出doi的作品的unofficalcomments的list，结构期望的相同

        /**
         * Request comment content from the backend
         */
        async getComments(){
            
            // Sample format for commentList
            // this.commentList=[
            //                   {content:"234234",
            //                    author:"xxxxx",},
            //                   {content:"234234",
            //                    author:"xxxxx",},
            //                   {content:"234234",
            //                    author:"xxxxx",}
            //                  ];

            // open the loading-animation
            this.loading=true;

            // send request
            var result = await this.$store.dispatch("commitwork/loadComments", 
                                                    {doi: this.doi, 
                                                     rankType: 'submittime',
                                                     username: this.$store.state.account.username,
                                                     type:"unofficial"})
                                            .catch(err => {
                                                            console.log(err);
                                                         });

            this.commentList = result;

            // close the loading-animation 
            this.loading=false; 

        },


    }
        
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
    position: relative;
}
.ant-list-item{
    border: none;
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
.ant-comment-content-author .ant-comment-content-author-time span{
    font-size: 1.2vw;
    line-height: -2vw
}
.ant-comment-content-detail p{
    font-size: 1.5vw;
    margin-bottom: 0;
}
.ant-comment-actions{
    margin: 0;
    padding: 0;
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
    padding: 0;
    margin-bottom: 1vw;
}
.ucomment .ant-comment .ant-comment-actions span span{
    font-size: 1.2vw;
}
.ucomment .ant-comment-content-detail p{
    margin-bottom: 1vh;
}

</style>