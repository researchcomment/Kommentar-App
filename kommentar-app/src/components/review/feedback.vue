<template>
    <div>
        <!-- List of Comments -->
        <a-list item-layout="vertical" size="large" :pagination="pagination" :data-source="commentList">
                 
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
                        <p @click="seeDetail(comment.doi_nr)">{{comment.doi_nr}}</p>
                    </a-descriptions-item>

                    <a-descriptions-item label="Visibility">
                        {{comment.active}}
                    </a-descriptions-item>

                    <a-descriptions-item label="Request">
                        <a-tag color="cyan" @click="visibleFeedback=true">Review</a-tag>
                    </a-descriptions-item>

                    <a-descriptions-item label="Content">
                       <p v-html="comment.content"></p>
                    </a-descriptions-item>

                </a-descriptions>

               
                <!-- Review Options -->
                <!-- Feedback -->
                <a-modal
                    title="Feedback"
                    :visible="visibleFeedback"
                    @ok="replyReview(comment)"
                    @cancel="handleCancel(comment)"
                    >
                    <b>Original Content</b>
                    <p v-html="comment.content"></p>

                    <!-- Input -->
                    <quill-editor
                        v-model="comment.replyContentReview"
                        :options="editorOptionReview">
                    </quill-editor>
                </a-modal>
                

            </a-list-item>
        </a-list>

    </div>
</template>

<script>
    export default {
        name:"reviewer",
        data(){
            return{
                commentList:[],

                pagination: {
                    onChange: page => {
                        console.log(page);
                    },
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
             * ! 涉及后端交互 getCommentListInReview() 
             * Request the CommentList, which status is "in Review", from background
             */
            async getCommentList(){

                // open the loading-animation
                this.loading=true;

                // get CommentList form firebase, the status from these comments is "in Review"
                // TODO:this.$store.....getCommentListInReview("Review");
                // TODO:this.commentList = result;


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
             * ! 涉及后端交互 
             * ! 接口 replyReview(UID,feedback)
             * Send Feedback to the firebase
             */
            replyReview(comment){
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
                    //TODO this.$store.dispatch("replyReview",this.comment.UID,feedback);

                    // Refresh the display, prompting success
                    var index =  this.commentList.indexOf(comment);
                    if (index > -1) {
                        this.commentList.splice(index, 1);
                    }
                    this.visibleFeedback = false;
                    this.$notification.open({
                        message: 'Success',
                        description:
                        'Your Feedback has been communicated.',
                        icon: <a-icon type="smile" style="color: #108ee9" />,
                    });  
                  
                }
                
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
                comment.replyContentReview = "";
                this.visibleFeedback =false;
            },

        }

        
    }
</script>

<style>
.avatarp{
    font-size: 2.5vw;
    line-height: 4.4vw;
}
</style>