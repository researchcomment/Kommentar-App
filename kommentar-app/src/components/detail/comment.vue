<template>
    <div style="position:relative">
        <a-comment v-if="comment.active || isModerator">
            <template slot="actions" >
                
                <!-- the number of likes -->
                <span key="comment-basic-like" class="action">
                    <a-tooltip title="Like">
                        <a-icon type="like" :theme="action === 'liked' ? 'filled' : 'outlined'" @click="dis_like('like')"/>
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
                            @click="dis_like('dislike')"
                            width="1.2vw" height="1.2vw"
                        />
                    </a-tooltip>
                    <span style="padding-left: '8px';cursor: 'auto'">
                        {{ comment.dislikes }}
                    </span>
                </span>
            
             
                <!-- Editing Options for Moderator : hide/unhide the comment -->
                <div v-if = "(isModerator) && !(comment.type=='official')"  class="auactions" @click="setVisiblity" style="margin-right:0.7vw">
                    <a-icon type="eye-invisible" v-if="comment.active"/>
                    <a-icon type="eye" v-if="!comment.active"/>
                </div>

                <!-- Editing Options for Author -->
                <div v-if = "isAuthor && !(comment.type=='official')" class="actionb" id="components-popover-demo-placement" :style="{whiteSpace: 'nowrap'}">
                <!-- popfirm -->
                    <a-popover placement="bottomLeft" v-model="visible" title="Options" trigger="click">
                            
                        <div slot="content">
                            <div :class="inReview?'auactionstabu':'auactions'"  @click="askForRequest('Review')">Ask For Review</div>

                            <div :class="inRequest?'auactionstabu':'auactions'" v-if="isResearcher" @click="askForRequest('PID')">Make it Public</div>

                            <div class="auactions"  @click="deleteComment">Delete <a-icon type="delete" theme="twoTone" two-tone-color="#eb2f96"/></div>

                            <div slot="content" v-if="!editorVisibility&&isAuthor&&(comment.type!='official')" @click="openEditor()" style="cursor:pointer">
                                Editor <a-icon type="edit"/>
                            </div>
                        </div>
                        <i class="iconfont icon-xiaoxiguanli-quanbux" @click="hide" style="cursor:pointer;font-size:0.8em"></i>
                    </a-popover>
                    
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
            <p slot="content" v-if="!editorVisibility" v-html="comment.content" class="ql-editor" style="margin-right:0.5vw"></p>
            
            <a-icon slot="content" type="up-circle" style="cursor:pointer" v-if="editorVisibility" @click="closeeditor()"/>
            <!-- Editor for Comments -->
            <div v-if="editorVisibility" slot="content" class="littleedit"> 
                <quill-editor
                v-model="content"
                :options="editorOption"
                >
                </quill-editor>
                <button @click="editorRequest()" >Submit</button>
            </div>
            
            <!-- time -->
            <a-tooltip slot="datetime" >
                <span>{{ new Date(Date.parse(comment.createDate)).toLocaleString()}}</span>
            </a-tooltip>        
            
        </a-comment>   
        <div  v-if="!comment.active" v-bind:style="{
            width: '100%',
            height: '100%',
            position: 'absolute',
            background: 'rgba(0,0,0,0.6)',
            opacity: '0.6',
            bottom: '0',
            }">
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
                comment:this.commentFromParent, 
                cansee:'none',
                content:"",
                editorVisibility:false,
                editorOption: {    // style for quill-editor
                    placeholder: "Please write down your comment....",
                    modules:{
                        toolbar:[
                                ['bold', 'italic', 'underline', 'strike'],    // toggled buttons
                                [{ 'font': [] }],  
                                [{ 'color': [] }],   // font color
                                ]
                            }
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
                var login = this.$store.state.account.role;
                return login? login.includes("Researcher"):false;
            },

            isAuthor(){
                return this.comment.author == this.username;
            },

            /**
             * @returns true, if the current user is Moderator
             */
            isModerator(){

                var login = this.$store.state.account.role;

                if(login){
                    return this.$store.state.account.role.includes("Moderator"); // check whether the logged user is Moderator
                }
                else{
                    return false; // not logged => not Moderator
                }

            },

            /**
             * @returns {boolean}, true, if the user has already submitted a review request
             */
            inReview(){
                return this.comment.status["Review"] ;
            },

            /**
             * @returns {boolean}, true, if the user has already submitted a request for PID
             */
            inRequest(){
                return this.comment.status["PID"]; 
            },

        },

        methods: {

            hide() {
                this.visible = false;
            },
            
            /**
             * send review Request to firebase
             */
            askForRequest(request){
                
                var requestName = this.comment.status[request]?    // inReview/inRequest  => cancel the Reqeust
                    "askFromUser/askForRequestCancel":"askFromUser/askForRequest";
                
                var result = this.$store.dispatch(requestName,{
                    uid:this.comment.key,
                    doi:this.comment.doi_nr,
                    requestType:request,
                })
                .catch(err => {
                    console.log(err);
                });
                
                this.comment.status[request]=!this.comment.status[request];
            },

            /**
             * send delete Request to firebase
             */
            deleteComment(){
                
                this.deleted =true;
                
                this.$store.dispatch("askFromUser/deleteComment",{
                    uid:this.comment.key,
                    doi:this.comment.doi_nr,
                }).then(()=>{
                    this.$emit("refresh");
                });
            
            },

            /**
             * send Editor Request to firebase
             */
            editorRequest(){
                this.$store.dispatch("askFromUser/setAttribute",{
                    uid:this.comment.key, 
                    doi:this.comment.doi_nr,
                    attribute:"content",
                    value:this.content,
                })
                .then(()=>{
                   
                   // Refresh the display, prompting success                   
                    this.$notification.open({
                        message: 'Success',
                        description:
                        'Your Request has been submitted.',
                        icon: <a-icon type="smile" style="color: #108ee9" />,
                    });  
                    this.comment.content=this.content;
                    this.editorVisibility =false;
                    this.$emit("refresh");
                })
                .catch(err => {
                                console.log(err);
                            });

            },
           
            /**
             * When the user clicks the like or dislike button, send like or dislike request to firebase
             * @param: flag  -"like"/"dislike"
             */
            dis_like(flag) {
                if(!this.alreadySendLikes){
                    this.action = flag+"d";
                    this.alreadySendLikes =true;    // Can't repeat dislikes
                    if (flag=="like")
                        this.comment.likes += 1;
                    else
                        this.comment.dislikes+=1;   

                    this.$store.dispatch("askFromUser/setAttribute",{
                        uid:this.comment.key,
                        doi:this.comment.doi_nr,
                        attribute:flag+"s",
                    });
                }
            },

            /**
             * The Admin ask firebase to hide/unhide the comment
             */
            setVisiblity(){
                this.comment.active = !this.comment.active;
                this.$store.dispatch("askFromUser/setAttribute",{
                        uid:this.comment.key,
                        doi:this.comment.doi_nr,
                        attribute:"active",
                        value:this.comment.active,
                });

            },

            openEditor(){
                this.content =this.comment.content;
                this.editorVisibility = !this.editorVisibility;
            },
            closeeditor(){
                this.editorVisibility = !this.editorVisibility;
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
    height: 5vh;
    text-decoration: line-through;
}
.actionb{
    left: 10vw;
}
.ant-comment{
    z-index: 500;
}
.littleedit{
    margin: 1vh 0;
}
.littleedit button{
    margin-top: 2vh;
}
.ant-comment .ant-comment-actions{
    margin: 0;
}
.ant-comment .ant-comment-content .ant-comment-content-detail p{
    margin-bottom: 0;
}
.ant-comment .ant-comment-content .ant-comment-content-detail {
    margin-bottom: 1vh;
}
.ant-comment .ant-comment-content .ant-comment-actions{
    margin: 0;
    margin-bottom: 2vw;
    padding: 0;
}
.ant-comment .ant-comment-content-detail .ql-editor{
    padding: 0;
}
</style>