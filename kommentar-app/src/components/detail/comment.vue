<template>
    <div>
        <a-comment v-if="comment.active || isModerator ">
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
                    />
                    </a-tooltip>
                    <span style="padding-left: '8px';cursor: 'auto'">
                    {{ comment.dislikes }}
                    </span>
                </span>


                <!-- Editing Options for Author -->
                <div v-if = "isAuthor">
                    
                    <a-button type="dashed" v-if="!(comment.type=='official')" :disabled="inReview" @click="askForRequest('Review')">Review</a-button>

                    <a-button type="dashed"  v-if="(isResearcher) && (!(comment.type=='official'))"  :disabled="inRequest" @click="askForRequest('PID')">Ask For PermanentID</a-button>

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
             * send review or PID Request to firebase
             * request:PID/Review
             */
           

            askForRequest(request){
                var result = this.$store.dispatch("askFromUser/askForRequest",{
                    uid:this.comment.key,
                    doi:this.comment.doi_nr,
                    requestType:request,
                })
                .catch(err => {
                    console.log(err);
                });
                
                this.comment.status[request]=true;

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
                    this.$emit("refresh");
                    this.editorVisibility =false;

                })
                .catch(err => {
                                console.log(err);
                            });

            },
           
            /**
             * When the user clicks the like or dislike button, send like or dislike request to firebase
             * flag:"like"/"dislike"
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