<template>
    <div class="ucomment">
        <h2 style="font-size:2vw;color:#000">Comments <span style="color:#ABABAB;font-size:1.5vw">{{uncomnum}}</span></h2>
        <ul>
            <li v-for="item in commentList" v-bind:key="item.id">
                <div>
                    <comment :comment="item" />
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
        //ask data base the comments

        //后端提供方法:loadUnOfficialComments, rankType
        //输入需要 doi
        //返回所有对于给出doi的作品的unofficalcomments的list，结构期望的相同
        async getComments(){
            /*
            this.commentList=[
                        {content:"234234",
                            author:"xxxxx",},
                        {content:"234234",
                            author:"xxxxx",},
                        {content:"234234",
                            author:"xxxxx",}
                        ]，
                        [
                        ]
                        */
            var result = await this.$store.dispatch("commitwork/loadUnOfficialComments", 
            {doi : this.doi, rankType : 'submittime'})
            console.log(result)
            this.commentList = result;
        }
    }
        
}
</script>

<style>
.ucomment ul{
    list-style-type: none;
    padding: 1vh;
}
.ucomment{
    margin: 2vh 10vw;
}
.ucomment li{
    margin-bottom: 1vh;
}
.ucomment .ant-comment-inner{
    padding: 0;
}
.ucomment .ant-comment-inner .ant-comment-avatar img{
    width: 3vh;
    height: 3vh;
    margin: 0;
}
.ucomment .ant-comment-inner .ant-comment-avatar {
    margin: 0;
}
.ucomment .ant-comment-actions{
    margin: 0;
    padding: 0;
}
.ucomment .ant-comment-content-detail p{
    margin-bottom: 0;
}
</style>