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
    components:{
        comment,
    },
    data(){
        return {
            commentList:[
                        {content:"234234",
                            author:"xxxxx",},
                        {content:"234234",
                            author:"xxxxx",},
                        {content:"234234",
                            author:"xxxxx",}
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
        uncomnum: function(){
            return this.commentList.length
        }
    },
    methods:{
        //ask data base the comments
        getComments(){
            this.commentList=[
                        {content:"234234",
                            author:"xxxxx",},
                        {content:"234234",
                            author:"xxxxx",},
                        {content:"234234",
                            author:"xxxxx",}
                        ];
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