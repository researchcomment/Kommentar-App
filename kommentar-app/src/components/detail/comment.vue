<template>
<div>
    <a-comment v-if="comment.active || isAdmin">
        <template slot="actions" >
            <!-- the number of likes -->
            <span key="comment-basic-like" class="action">
                <a-tooltip title="Like">
                <a-icon type="like" :theme="action === 'liked' ? 'filled' : 'outlined'" @click="like"/>
                </a-tooltip>
                <span style="padding-left: '8px';cursor: 'auto'">
                    {{ comment.likes }}
                </span>
            </span>

            <!-- the number of dislikes -->
            <span key="comment-basic-dislike" class="action">
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

            <div v-if = "isAdmin"  class="auactions" @click="setVisiblity" style="margin-right:0.7vw">
                <a-icon type="eye-invisible" v-if="comment.active"/>
                <a-icon type="eye" v-if="!comment.active"/>
            </div>
            <!-- Editing Options for Author -->
            <div v-if = "isAuthor" class="actionb">
                <!-- popfirm -->
                <div id="components-popover-demo-placement">
                    <div :style="{whiteSpace: 'nowrap'}">
                        <a-popover placement="bottomLeft" v-model="visible" title="Options" trigger="click">
                             
                            <div slot="content" >
                                <div :class="inReview?'auactionstabu':'auactions'"  @click="askForReview">Ask For Review</div>

                                <div :class="inRequest?'auactionstabu':'auactions'" v-if="(isResearcher) && (!comment.PermanentID)" @click="askForPID">Ask For PermanentID</div>

                                <div class="auactions" @click="deleteComment">Delete <a-icon type="delete" theme="twoTone" two-tone-color="#eb2f96"/></div>
                                
                                <!-- Editing Options for Admin : hide/unhide the comment -->
                                
                            </div>
                            <i class="iconfont icon-xiaoxiguanli-quanbux" @click="hide" style="cursor:pointer"></i>
                        </a-popover>
                    </div>
                </div>
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
                <span>{{ comment.time.toLocaleString( )}}</span>
            </a-tooltip>

            
            
    </a-comment>
    <!-- cover -->
    <div :style="TheCover">
                     
	</div>
</div>
    
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
                buttonWidth: 10,
                visible: false,
               // comment:this.commentFromParent, 改完取消这行注释
               //! Sample Comment FOR TEST 改完注释调
                comment: {
                    doi:" ",    // not used hier

                    ID:"MAKAVIVZSVSDFSDF",    // UID for comment 
                    PermanentID:"",    // '' or 'ASDASDAS'
                    commentType:"unofficial",    // "official", "unofficial"
                    status:[],    // ["in Review", "ask for PID",...] 
                    active:true,    // the Admin can hide the comments

                    author:this.commentFromParent.author,
                    authorRole:["default","Researcher"],    // ["default", "Researcher",....]
                    content:this.commentFromParent.content,    // the comment is in html form 

                    time: new Date(),
                    likes: 0,
                    dislikes: 0,
                },   
                TheCover:{
                    width: '100%',
                    height: '100%',
	                position: 'absolute',
	                background: 'rgba(0,0,0,0.6)',
	                opacity: '0.6',
                    bottom: '0',
                    display:'none',
                },
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
                return this.comment.authorRole.indexOf("Researcher") > -1 ;
            },

            isAuthor(){
                return this.comment.author == this.username;
            },

            /**
             * @returns true, if the current user is Admin
             */
            isAdmin(){
                return true; //! FOR TEST

                var login = this.$store.state.account.username;

                if(login){
                    return (this.$store.state.account.role.indexOf("Admin"))>-1; // check whether the logged user is Admin
                }
                else{
                    return false; // not logged => not Admin
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
             * 弹窗
             */
            hide() {
                console.log(111);
                this.visible = false;
            },
            /**
             * ! 涉及后端交互
             * send review Request to firebase
             */
            askForReview(){

                // JJY : 暂时前端应该已经拦截了role不对的 已经在review的 应该不会发生重复提交申请的问题
                //TODO this.$store.dispatch("review",this.comment.ID);
                
                this.comment.status.push("in Review");

            },

            /**
             * ! 涉及后端交互
             * ask firebase for PermanentID
             */
            askForPID(){
                
                // JJY : 暂时前端应该已经拦截了role不对的 已经有PID的 已经申请PID的
                //TODO this.$store.dispatch("askForPID",this.comment.ID);

                this.comment.status.push("ask for PID");
            },

            /**
             * ! 涉及后端交互
             * send delete Request to firebase
             */
            deleteComment(){
                //TODO this.$store.dispatch("delete",this.comment.ID);
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
                       
                    //TODO this.$store.dispatch("like",this.comment.ID);
                                              
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
                    
                    //TODO this.$store.dispatch("dislike",this.comment.ID);

                }
            },

            /**
             * ! 涉及后端交互
             * The Admin ask firebase to hide/unhide the comment
             */
            setVisiblity(){
                this.comment.active = !this.comment.active;

                //TODO this.$store.dispatch("setVisiblity",this.comment.ID);
                //show cover
                if(this.$data.TheCover.display=='none'){
                   this.$data.TheCover.display='block'; 
                }else{
                    this.$data.TheCover.display='none'; 
                }
                
            }
        },
};
</script>

<style>
.avatarp{
    font-size: 2.5vw;
    line-height: 4.4vw;
}
#components-popover-demo-placement .ant-btn {
  width: 5vw;
  text-align: center;
  padding: 0;
  margin-right: 3vw;
  margin-bottom: 3vw;
}
.auactions{
    cursor: pointer;
    height: 5vh;
}
.auactionstabu{
    pointer-events: none;
    height: 5vh;
    text-decoration: line-through;
}
.actionb{
    left: 10vw;
}
.ant-comment{
    z-index: 500;
}
</style>