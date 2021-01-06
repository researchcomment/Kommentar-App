<template>
    <div>
        <!-- List of Comments -->
        <a-list item-layout="vertical" size="large" :pagination="pagination" :data-source="commentList">
                 
            <a-list-item slot="renderItem" slot-scope="comment" >
                
                <!-- About Author -->
                <a-list-item-meta>
                    <!-- Author -->
                    <div slot="title">{{ comment.author }}</div>
                    
                    <!-- Author picture -->  
                    <a-avatar slot="avatar" style="color: #f56a00; backgroundColor: #fde3cf">
                        <p>{{comment.author[0]}}</p>
                     </a-avatar>     
                </a-list-item-meta>
                
                <!-- Detail about this comment -->
                <a-descriptions  bordered  :column="{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }">
                    <a-descriptions-item label="Create Date">{{new Date(Date.parse(comment.createDate)).toLocaleString()}}</a-descriptions-item>
                    <a-descriptions-item label="type">{{comment.type}}</a-descriptions-item>
                    
                    <a-descriptions-item label="Book Link">
                        <p style="cursor:pointer;color:#1890ff" @click="seeDetail(comment.doi_nr)">{{comment.title}}</p>
                        <a :href="'https://dx.doi.org/'+ comment.doi_nr"  target="_blank">{{comment.doi_nr}}</a>
                    </a-descriptions-item>

                    <a-descriptions-item label="Visibility">
                        <p v-show="comment.active">Yes</p>
                        <p v-show="!comment.active">No</p>
                    </a-descriptions-item>

                    <a-descriptions-item label="Likes">
                        {{comment.likes}}
                    </a-descriptions-item>

                    <a-descriptions-item label="Disliks">
                        {{comment.dislikes}}
                    </a-descriptions-item>

                    <a-descriptions-item label="Request">
                        <a-tag style="cursor:pointer" color="purple" @click="openEditor(comment)">PID</a-tag>
                    </a-descriptions-item>

                    <a-descriptions-item label="Content">
                       <p v-html="comment.content" class="ql-editor"></p>
                    </a-descriptions-item>

                </a-descriptions>

               
               

            </a-list-item>
        </a-list>

         <!-- Review Options -->
        <!-- Reply for Permanent ID -->
        <a-modal
            title="Permanent ID"
            :visible="visiblePID"
            @ok="replyPID"
            @cancel="handleCancel"
            >

            <b>Original Content</b>
            <p v-html="templateComment.content" class="ql-editor"></p>

            <!-- agree or not -->
            <a-radio-group v-model="templateComment.agreePID" default-value="agree">
                <a-radio-button value="agree" style="margin-bottom:2vw;margin-right:2vw">
                    Agree <a-icon type="check-square" theme="twoTone" two-tone-color="#52c41a"/>
                </a-radio-button>
                <a-radio-button value="refuse">
                    Refuse <a-icon type="close-square" theme="twoTone" two-tone-color="#eb2f96" />
                </a-radio-button>
            </a-radio-group>

            <!-- Input -->
            <quill-editor
                v-model="templateComment.replyContentPID"
                :options="editorOptionPID">
            </quill-editor>
            
        </a-modal>
        
        
    </div>
</template>

<script>
    export default {
        name:"reviewer",
        data(){
            return{
                commentList:[],
                templateComment:{},

                pagination: {
                    pageSize: 6,
                },

                
                visiblePID:false,
                editorOptionPID: {    // style for quill-editor by PID
                    placeholder: "Write your Reason......   \n(Must fill in, if the request is rejected)",
                    modules:{
                        toolbar:[
                                ['bold', 'italic', 'underline', 'strike'],    // toggled buttons
                                [{ 'font': [] }],  
                                [{ 'color': [] }],   // font color
                                ]
                            }
                }, 


            }
        },

        mounted(){
            this.getCommentList();
        },

        methods:{
            
            /**
             * Request the CommentList, which status has "PID", from background
             */
            async getCommentList(){

                // get CommentList form firebase, the status from these comments is "in Review"               
                this.$store.dispatch("adminAktion/getCommentListForRequest", 
                                                    {requestType:"PID"})
                .then((result)=>{
                                
                                this.commentList= Object.keys(result).map((key) => {
                                    var comment = result[key];
                                    comment.key=key;
                                    return comment;
                                })
 
                                })
                .catch(err => {
                                console.log(err);
                              });

            },

            /**
             * Send to the firebase whether the request for PermanentID is passed
             */
            replyPID(){
                var comment = this.templateComment;
                var reason = comment.replyContentPID;
                var agree = !(comment.agreePID=="refuse");
                if((!agree)&&(!reason)){
                    // check if the reason is filled by disagree
                    this.$error({
                            title: 'Error message',
                            content: 'Please write down your Reason (Must fill in, if the request is rejected)',
                    });
                    return;
                }
                if(!reason){
                    reason ="";
                }

                if(agree){
                    reason = '<h2 style="color:green">Your Request of Permanent ID is accepted</h2>'+ reason;
                }
                else{
                    reason = '<h2 style="color:red">Your Request of Permanent ID is denied.</h2>'+ reason;
                }

                var request = {
                    doi:comment.doi_nr,
                    comment_uid:comment.key,
                    user_id:comment.user_id,
                    requestType:"PID",
                    feedback_content:reason,
                    flag:agree,
                    comment_content:comment.content,
                };
                    
                //send Request to firebase  
                this.$store.dispatch("adminAktion/replyRequest",request).then(()=>{
                    this.visiblePID = false;
                    this.$notification.open({
                        message: 'Success',
                        description:
                        'Your evaluation has been communicated.',
                        icon: <a-icon type="smile" style="color: #108ee9" />,
                    });

                });

                this.getCommentList();
               
            },

            /**
             * open a new window which shows the details of this book
             */
            seeDetail(doi){

                // build router address
                let routeData = this.$router.resolve({
                    path: '/detail', 
                    query:{doi:doi},   
                });

                //open a new window
                window.open(routeData.href, "_blank");

            },

            /**
             * reset the comment by Cancel
             * @param comment
             */
            handleCancel(comment){
                this.templateComment = {};
                this.visiblePID =false;
            },

            openEditor(comment){
                this.templateComment =JSON.parse(JSON.stringify(comment));
                this.visiblePID =true;
            }

        }

        
    }
</script>

<style>
.fb .ant-list-item-meta-avatar .ant-avatar-string p{
    font-size: 16px;
    line-height: 30px;
}
</style>