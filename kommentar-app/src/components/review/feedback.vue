<template>
    <div>
        <!-- List of Comments -->
        <a-list item-layout="vertical" size="large" :pagination="pagination" :data-source="commentList" >
                 
            <a-list-item slot="renderItem" slot-scope="comment" >
                
                <!-- About Author -->
                <a-list-item-meta>
                    <!-- Author -->
                    <a slot="title">{{ comment.author }}</a>
                    
                    <!-- Author picture -->  
                    <a-avatar slot="avatar" style="color: #f56a00; backgroundColor: #fde3cf">
                        <p class="avatarp">{{comment.author[0]}}</p>
                     </a-avatar>     
                </a-list-item-meta>
                
                <!-- Detail about this comment -->
                <a-descriptions  bordered  :column="{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }">
                    <a-descriptions-item label="Create Date">{{comment.createDate}}</a-descriptions-item>
                    <a-descriptions-item label="type">{{comment.type}}</a-descriptions-item>
                    
                    <a-descriptions-item label="Book Link">
                        <p @click="seeDetail(comment.doi_nr)">{{comment.title}}</p>
                        <a :href="'https://dx.doi.org/'+ comment.doi_nr"  target="_blank">Link Outside</a>
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
                        <a-tag color="cyan" @click="openEditor(comment)">Review</a-tag>
                    </a-descriptions-item>

                    <a-descriptions-item label="Content">
                       <p v-html="comment.content"></p>
                    </a-descriptions-item>

                </a-descriptions>

               
               
                

            </a-list-item>
        </a-list>

        <!-- Review Options -->
        <!-- Feedback -->
        <a-modal
            title="Feedback"
            :visible="visibleFeedback"
            @ok="replyReview"
            @cancel="handleCancel"
            >
            <b>Original Content</b>
            <p v-html="templateComment.content"></p>

            <!-- Input -->
            <quill-editor
                v-model="templateComment.replyContentReview"
                :options="editorOptionReview">
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

                visibleFeedback:false,
               
                editorOptionReview: {    // style for quill-editor by Review
                    placeholder: "Write your Feedback......\n (Must fill in)",
                    modules:{
                        toolbar:[
                                ['bold', 'italic', 'underline', 'strike'],    // toggled buttons
                                ['blockquote', ], 
                                [{ 'color': [] }],   // front color
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
             * Request the CommentList, which status is "in Review", from background
             */
            async getCommentList(){

                // open the loading-animation
                this.loading=true;

                this.$store.dispatch("adminAktion/getCommentListForRequest", 
                                                    {requestType:"Review"})
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

                // close the loading-animation 
                this.loading=false; 

            },

            
            /**
             * Send Feedback to the firebase
             */
            replyReview(){
               
                var comment =this.templateComment;
                var feedBack = comment.replyContentReview;
                // check if the feedback is filled
                if(!feedBack){
                    this.$error({
                        title: 'Error message',
                        content: 'Please write down your Feedback',
                    });
                    return;
                }
                else{
                    var request = {
                        doi:comment.doi_nr,
                        comment_uid:comment.key,
                        user_id:comment.user_id,
                        requestType:"Review",
                        feedback_content:feedBack,
                        comment_content:comment.content,
                    };
                    this.$store.dispatch("adminAktion/replyRequest",request).then(()=>{
                        // Refresh the display, prompting success
                        this.visibleFeedback = false;
                        this.$notification.open({
                            message: 'Success',
                            description:
                            'Your Feedback has been communicated.',
                            icon: <a-icon type="smile" style="color: #108ee9" />,
                        });   

                    });    
                  
                }

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
             */
            handleCancel(){
                this.templateComment = {};
                this.visibleFeedback =false;
            },

            openEditor(comment){
                this.templateComment =JSON.parse(JSON.stringify(comment));
                this.visibleFeedback =true;
            }

        }

        
    }
</script>

<style>
.avatarp{
    font-size: 2.5vw;
    line-height: 4.4vw;
}
</style>