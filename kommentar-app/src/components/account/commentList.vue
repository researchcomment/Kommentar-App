<template>
    <div>
        <!-- List of Comments -->
        <a-list item-layout="vertical" size="large" :pagination="pagination" :data-source="commentList">
                 
            <a-list-item slot="renderItem" slot-scope="comment"  >
                
                <!-- Detail about this comment -->
                <a-descriptions  bordered  :column="{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }">
                    <a-descriptions-item label="Create Date">{{comment.createDate}}</a-descriptions-item>
                    <a-descriptions-item label="type">{{comment.type}}</a-descriptions-item>
                    
                    <a-descriptions-item label="Book Link">
                        <p @click="seeDetail(comment.doi_nr)">{{getTitle(comment.doi_nr)}}</p>
                    </a-descriptions-item>

                    <a-descriptions-item label="Requests in Checking">
                        <a-tag  v-if="comment.status['Review']">Review</a-tag>
                        <a-tag  v-if="comment.status['PID']">PID</a-tag>
                    </a-descriptions-item>

                    <a-descriptions-item label="New Request">
                        
                        <!-- Review Request -->
                        <a-tag 
                        color="cyan" 
                        v-if="!comment.status['Review']&&comment.type!='official'"  
                        @click="newRequest('Review',comment)">
                        Review
                        </a-tag>

                        <!-- PID Request -->
                        <a-tag 
                        color="cyan" 
                        v-if=" !comment.status['PID'] && role.indexOf('Researcher')>-1&&comment.type!='official'" 
                        @click="newRequest('PID',comment)">
                            PID
                        </a-tag>
                    </a-descriptions-item>

                    
                    <a-descriptions-item label="Content" >
                       <p v-html="comment.content"></p>
                       <a-button :disabled="comment.type=='official'" type="edit" @click="openEditor(comment)">
                        Editor
                       </a-button>
                    </a-descriptions-item>

                </a-descriptions>
            </a-list-item>
        </a-list>

        <a-modal 
            :visible="editorVisibility" 
            title="Editor" 
            @ok="editorRequest"
            @cancel="editorVisibility =false">
            <quill-editor
                v-model="templateComment.content"
                :options="editorOption"
            >
            </quill-editor>
        </a-modal>

    </div>
</template>

<script>
    export default {
        name:"reviewer",
        data(){
            return{
                //commentList:[],
                templateComment:{},
               
                pagination: {
                    onChange: page => {
                        console.log(page);
                    },
                    pageSize: 6,
                },

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



            }
        },

        computed: {
    
            username() {
                return this.$store.state.account.username;
            },

            role() {
                return this.$store.state.account.role;
            },

            commentList(){
                
                return  this.$store.state.account.commentList;
            },

            title(doi){
                console.log(doi)
                return this.getTitle(doi);
            }
            

        },

        mounted(){
            this.getCommentList();
        },

        methods:{
            
            /**
             * Request the CommentList, which Author is the user, from background
             */
            async getCommentList(){

                // open the loading-animation
                // get CommentList form firebase, the status from these comments is "in Review"
                this.$store.dispatch("account/getCommentList")
                                            .catch(err => {
                                                            console.log(err);
                                                         });

                // close the loading-animation 

            },

            
            /**
             * Send request to the firebase
             * @param request - "Review" or "PID"
             * @param comment
             */
            newRequest(request,comment){
                var request ={
                    uid:comment.commitKey,
                    doi:comment.doi_nr, 
                    requestType:request,
                }
               
                this.$store.dispatch("askFromUser/askForRequest",request)
                .then(()=>{
                     // Refresh the display, prompting success
                    
                        this.$notification.open({
                            message: 'Success',
                            description:
                            'Your Request has been submitted.',
                            icon: <a-icon type="smile" style="color: #108ee9" />,
                        });  
                        this.getCommentList();

                    })
                .catch(err => {
                                console.log(err);
                            });
 
            },

            /**
             * send Editor Request to firebase
             */
            editorRequest(){
                var request ={
                    uid:this.templateComment.commitKey, 
                    doi:this.templateComment.doi_nr,
                    attribute:"content",
                    value:this.templateComment.content,
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
                    this.getCommentList();

                    })
                .catch(err => {
                                console.log(err);
                            });

            },

            getTitle(doi){
                this.$store.dispatch("commitwork/askfordetail", {
                                    doi:doi,
                                    username:this.username,}).then(()=>) 
                  
                //console.log(detail.title)
                return detail.title;
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
            
            openEditor(comment){
                this.templateComment =JSON.parse(JSON.stringify(comment));
                this.editorVisibility =true;
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