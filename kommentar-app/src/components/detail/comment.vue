<template>
    <div>
        <a-comment v-if="comment.active || isModerator ">
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


                <!-- Editing Options for Author -->
                <div v-if = "isAuthor">
                    
                    <a-button type="dashed" v-if="!(comment.type=='official')" :disabled="inReview" @click="askForReview">Review</a-button>

                    <a-button type="dashed"  v-if="(isResearcher) && (!(comment.type=='official'))"  :disabled="inRequest" @click="askForPID">Ask For PermanentID</a-button>

                    <a-button :disabled="comment.type=='official'" icon="edit" @click="openEditor()">Editor</a-button>
                
                    <a-icon type="delete" v-if="!(comment.type=='official')" theme="twoTone" two-tone-color="#eb2f96"  @click="deleteComment" />
               
                </div>

                <!-- Editing Options for Moderator : hide/unhide the comment -->
                <div v-if = "isModerator && !(comment.type=='official')">
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
                <p slot="content" v-if="!editorVisibility" v-html="comment.content"></p>

                <!-- Editor for Comments -->
                <div v-if="editorVisibility" slot="content"> 
                    <quill-editor
                    v-model="content"
                    :options="editorOption"
                    >
                    </quill-editor>
                    <a-button @click="editorRequest">Submit</a-button>
                </div>
                
                <!-- time -->
                <a-tooltip slot="datetime" >
                    <span>{{ new Date(Date.parse(comment.createDate)).toLocaleString()}}</span>
                </a-tooltip>        
                
        </a-comment>   

        
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

                comment:this.commentFromParent, 

                content:"",
                editorVisibility:false,
                editorOption: {    // style for quill-editor
                    placeholder: "Please write down your comment....",
                    modules:{
                        toolbar:[
                                ['bold', 'italic', 'underline', 'strike'],    // toggled buttons
                                ['blockquote', 'code-block'], 
                                // [{ 'size': ['small', false, 'large', 'huge'] }], // front size
                                [{ 'color': [] }],   // front color
                                ]
                            }
                }, 
               
               //! Sample Comment FOR TEST 
               /* comment: {
                    UID:"MAKAVIVZSVSDFSDF",    // UID for comment 
                    PermanentID:"",    // '' or 'ASDASDAS'
                    type:"unofficial",    // "official", "unofficial"
                    status:{
                        "Review":true,
                        "PID":false
                    },  
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
                var login = this.$store.state.account.role;
                if(login){
                    return this.$store.state.account.role.includes("Researcher");
                }
                return false;
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

                // Duplicate application is prohibited
                // in Reviewing => disable the Button
                return this.comment.status["Review"] ;

            },

            /**
             * @returns {boolean}, true, if the user has already submitted a request for PID
             */
            inRequest(){
                
                // Duplicate application is prohibited
                // already requested => disable the Button
                return this.comment.status["PID"];
                
            },

        },

        methods: {
            /**
             * send review Request to firebase
             */
            askForReview(){

                var request = {
                    uid:this.comment.key,
                    doi:this.comment.doi_nr,
                    requestType:"Review",
                }
    
                var result = this.$store.dispatch("askFromUser/askForRequest",request)
                                                .catch(err => {
                                                            console.log(err);
                                                         });
                
                this.comment.status["Review"]=true;

            },

            /**
             * ask firebase for PermanentID
             */
            askForPID(){
                
                var request = {
                    uid:this.comment.key,
                    doi:this.comment.doi_nr,
                    requestType:"PID",
                }
                
                var result = this.$store.dispatch("askFromUser/askForRequest",request)
                                                .catch(err => {
                                                            alert.log(err);
                                                         });

                this.comment.status["PID"]=true;
            },

            /**
             * send delete Request to firebase
             */
            deleteComment(){
                
                this.deleted =true;
                var request = {
                    uid:this.comment.key,
                    doi:this.comment.doi_nr,
                }
                
                this.$store.dispatch("askFromUser/deleteComment",request).then(()=>{
                    this.$emit("refresh");
                });
            
            },

            /**
             * send Editor Request to firebase
             */
            editorRequest(){
                var request ={
                    uid:this.comment.key, 
                    doi:this.comment.doi_nr,
                    attribute:"content",
                    value:this.content,
                }
                this.$store.dispatch("askFromUser/setAttribute",request)
                .then(()=>{
                   
                   // Refresh the display, prompting success                   
                    this.$notification.open({
                        message: 'Success',
                        description:
                        'Your Request has been submitted.',
                        icon: <a-icon type="smile" style="color: #108ee9" />,
                    });  
                    
                    this.editorVisibility =false;
                    this.$emit("refresh");

                })
                .catch(err => {
                                console.log(err);
                            });

            },
           
            /**
             * When the user clicks the like button, send like request to firebase
             */
            like() {
                if(!this.alreadySendLikes){
                    this.action = 'liked';
                    this.alreadySendLikes =true;    // Can't repeat likes
                    this.comment.likes += 1;
                       
                    var request = {
                        uid:this.comment.key,
                        doi:this.comment.doi_nr,
                        attribute:"likes",
                    };

                    this.$store.dispatch("askFromUser/setAttribute",request);
                                              
                }
                
            },

             /**
             * When the user clicks the like button, send dislike request to firebase
             */
            dislike() {
                if(!this.alreadySendLikes){
                    this.action = 'disliked';
                    this.alreadySendLikes =true;    // Can't repeat dislikes
                    this.comment.dislikes += 1;   
                    
                    var request = {
                        uid:this.comment.key,
                        doi:this.comment.doi_nr,
                        attribute:"dislikes",
                    };

                   this.$store.dispatch("askFromUser/setAttribute",request);

                }
            },

            /**
             * The Admin ask firebase to hide/unhide the comment
             */
            setVisiblity(){
                this.comment.active = !this.comment.active;
                
                var request = {
                        uid:this.comment.key,
                        doi:this.comment.doi_nr,
                        attribute:"aktive",
                        value:this.comment.active,
                };
                
                this.$store.dispatch("askFromUser/setAttribute",request);

            },

            openEditor(){
                this.content =this.comment.content;
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