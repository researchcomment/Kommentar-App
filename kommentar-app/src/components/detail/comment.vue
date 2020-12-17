<template>
    <a-comment v-if="comment.active || isModerator">
        <template slot="actions" >
            <!-- the number of likes -->
            <span key="comment-basic-like">
                <a-tooltip title="Like">
                <a-icon type="like" :theme="action === 'liked' ? 'filled' : 'outlined'" @click="like"/>
                </a-tooltip>
                <span style="padding-left: '8px';cursor: 'auto'">
                    {{ comment.likes }}
                </span>
            </span>

            <!-- the number of dislikes -->
            <span key="comment-basic-dislike">
                <a-tooltip title="Dislike">
                <a-icon
                    type="dislike"
                    :theme="action === 'disliked' ? 'filled' : 'outlined'"
                    @click="dislike"
                />
                </a-tooltip>
                <span style="padding-left: '8px';cursor: 'auto'">
                {{ comment.dislikes }}
                </span>
            </span>
            <span key="comment-basic-reply-to">Reply to</span>

            <!-- Editing Options for Author -->
            <div v-if = "isAuthor">
                
                <a-button type="dashed" :disabled="inReview" @click="askForReview">Review</a-button>

                <a-button type="dashed"  v-if="(isResearcher) && (!comment.PermanentID)"  :disabled="inRequest" @click="askForPID">Ask For PermanentID</a-button>

                <a-icon type="delete" theme="twoTone" two-tone-color="#eb2f96"  @click="deleteComment" />
         
            </div>

            <!-- Editing Options for Moderator : hide/unhide the comment -->
            <div v-if = "isModerator">
                <a-icon type="eye-invisible" v-if="comment.active" @click="setVisiblity"/>
                <a-icon type="eye" v-if="!comment.active" @click="setVisiblity"/>
            </div>
            


        </template>
    
        <!-- the detail of this comment -->
            
            <!-- Author -->
            <a slot="author">{{comment.author}}</a>

            <!-- Author picture -->  
            <a-avatar slot="avatar" style="color: #f56a00; backgroundColor: #fde3cf">
                <p class="avatarp">{{authorfirst}}</p>
            </a-avatar>

            <!-- Comment -->
            <p slot="content" v-html="comment.content"></p>
            
            <!-- time -->
            <a-tooltip slot="datetime" >
                <span>{{ comment.createDate}}</span>
            </a-tooltip>

            

    </a-comment>
</template>

<script>

import Antd from 'ant-design-vue'
import Vue from 'vue'
import moment from 'moment';
import 'ant-design-vue/dist/antd.css'
Vue.use(Antd)

    export default {

        props:["commentFromParent", "username"],

        data() {
            return {
                action: null,
                alreadySendLikes:false,    // Can't repeat likes 
               
                comment:this.commentFromParent, 
               //! Sample Comment FOR TEST 改完注释调
               /* comment: {
                    UID:"MAKAVIVZSVSDFSDF",    // UID for comment 
                    PermanentID:"",    // '' or 'ASDASDAS'
                    type:"unofficial",    // "official", "unofficial"
                    status:[],    // ["in Review", "ask for PID",...] 
                    active:true,    // the Admin can hide the comments
                    author:this.commentFromParent.author,
                    content:this.commentFromParent.content,    // the comment is in html form 
                    createDate: "2020-12-12",
                    likes: 0,
                    dislikes: 0,
                },   
                */
            };
        },

        computed:{
            
            /**
             * @returns {String} a part of the author name
             */
            authorfirst(){
                return this.comment.author[0];
            },

            isResearcher(){
                return (this.$store.state.account.role.indexOf("Reacher"))>-1;
            },

            isAuthor(){
                return this.comment.author == this.username;
            },

            /**
             * @returns true, if the current user is Moderator
             */
            isModerator(){

                var login = this.$store.state.account.username;

                if(login){
                    return (this.$store.state.account.role.indexOf("Moderator"))>-1; // check whether the logged user is Moderator
                }
                else{
                    return false; // not logged => not Moderator
                }

            },

            /**
             * @returns {boolean}, true, if the user has already submitted a review request
             */
            inReview(){

                // Duplicate application is prohibited
                // in Reviewing => disable the Button
                return this.comment.status.indexOf("in Review") > -1 ;

            },

            /**
             * @returns {boolean}, true, if the user has already submitted a request for PID
             */
            inRequest(){
                
                // Duplicate application is prohibited
                // already requested => disable the Button
                return this.comment.status.indexOf("ask for PID") > -1 ;
                
            },

        },

        methods: {
            /**
             * ! 涉及后端交互
             * send review Request to firebase
             */
            askForReview(){

                // JJY : 暂时前端应该已经拦截了role不对的 已经在review的 应该不会发生重复提交申请的问题
                //TODO this.$store.dispatch("review",this.comment.UID);
                
                this.comment.status.push("in Review");

            },

            /**
             * ! 涉及后端交互
             * ask firebase for PermanentID
             */
            askForPID(){
                
                // JJY : 暂时前端应该已经拦截了role不对的 已经有PID的 已经申请PID的
                //TODO this.$store.dispatch("askForPID",this.comment.UID);

                this.comment.status.push("ask for PID");
            },

            /**
             * ! 涉及后端交互
             * send delete Request to firebase
             */
            deleteComment(){
                //TODO this.$store.dispatch("delete",this.comment.UID);
                this.$emit("refresh");
            },
           
            /**
             * ! 涉及后端交互
             * When the user clicks the like button, send like request to firebase
             */
            like() {
                if(!this.alreadySendLikes){
                    this.action = 'liked';
                    this.alreadySendLikes =true;    // Can't repeat likes
                    this.comment.likes += 1;
                       
                    //TODO this.$store.dispatch("like",this.comment.UID);
                                              
                }
                
            },

             /**
             * ! 涉及后端交互
             * When the user clicks the like button, send dislike request to firebase
             */
            dislike() {
                if(!this.alreadySendLikes){
                    this.action = 'disliked';
                    this.alreadySendLikes =true;    // Can't repeat dislikes
                    this.comment.dislikes += 1;   
                    
                    //TODO this.$store.dispatch("dislike",this.comment.UID);

                }
            },

            /**
             * ! 涉及后端交互
             * The Admin ask firebase to hide/unhide the comment
             */
            setVisiblity(){
                this.comment.active = !this.comment.active;

                //TODO this.$store.dispatch("setVisiblity",this.comment.UID);

            }
        },
};
</script>

<style>
.avatarp{
    font-size: 2.5vw;
    line-height: 4.4vw;
}
</style>