<template>
    <div class="ocomment">
        <h2 style="font-size:2.5vw;color:#76C06B">Official Comments <span style="color:#ABABAB;font-size:1.5vw">{{comnum}}</span></h2>
        <ul>
            <li  v-for="item in commentList" v-bind:key="item.id" >
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
        comnum: function(){
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
.ocomment ul{
    list-style-type: none;
    padding: 1vw;
}
.ocomment li{
    margin-bottom: 5vh;
}
.ocomment{
    margin: 3vh 10vw;
}
.ocomment .ant-comment-inner{
    padding: 0;
}
.ocomment .ant-comment-content-author a{
    font-size: 3vh;
}
.ocomment .ant-comment-content-detail p{
    font-size: 4vh;
    margin-bottom: 0;
}
.ocomment .ant-comment-actions{
    margin: 0;
    padding: 0;
}
.ocomment .ant-comment-actions span{
    font-size: 2vh;
}
</style>