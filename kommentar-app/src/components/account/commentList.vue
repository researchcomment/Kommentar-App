<template>
    <div>
        <!-- Filter -->
        <a-input placeholder="DOI...."  v-model="searchDOI"/>

        <!-- List of Comments -->
        <a-list item-layout="vertical" size="large" :pagination="pagination" :data-source="commentList">
                 
            <a-list-item slot="renderItem" slot-scope="comment,index"  v-show="relate(comment)" >
                
                <!-- Detail about this comment -->
                <a-descriptions  bordered  :column="{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }">
                    <a-descriptions-item label="Create Date">{{new Date(Date.parse(comment.createDate)).toLocaleString()}}</a-descriptions-item>
                    <a-descriptions-item label="type">{{comment.type}}</a-descriptions-item>
                    
                    <a-descriptions-item label="Book Link">
                        <p @click="seeDetail(comment.doi_nr)">{{comment.title}}</p>
                        <a :href="'https://dx.doi.org/'+ comment.doi_nr"  target="_blank">{{comment.doi_nr}}</a>
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
                        v-if=" !comment.status['PID'] && role.includes('Researcher')&&comment.type!='official'" 
                        @click="newRequest('PID',comment)">
                            PID
                        </a-tag>
                    </a-descriptions-item>

                </a-descriptions>

                <h2>Content</h2>
                <p  v-if="!editorVisibility[index]" v-html="comment.content"></p>
                <div v-if="editorVisibility[index]"> 
                    <quill-editor
                    v-model="templateComment.content"
                    :options="editorOption"
                    >
                    </quill-editor>
                    <a-button @click="editorRequest">Submit</a-button>
                </div>

                <a-button :disabled="comment.type=='official'" icon="edit" @click="openEditor(comment,index)" >Editor</a-button>
                <a-icon type="delete" v-if="!(comment.type=='official')" theme="twoTone" two-tone-color="#eb2f96"  @click="deleteComment(comment)" />

            </a-list-item>
            
        </a-list>

        

    </div>
</template>

<script>
    export default {
        name:"reviewer",
        data(){
            return{
               
                templateComment:{},
                title:[],
               
                pagination: {
                    pageSize: 6,
                },
                
               
                searchDOI:"",

                editorVisibility:[],
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
            
        },

        mounted(){
            this.getCommentList();
        },

        methods:{
            
            /**
             * Request the CommentList, which Author is the user, from background
             */
            async getCommentList(){

                // get CommentList form firebase, the status from these comments is "in Review"
                this.$store.dispatch("account/getCommentList")
                                            .catch(err => {
                                                            console.log(err);
                                                         });

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
                    
                    this.editorVisibility =[];
                    this.getCommentList();

                    })
                .catch(err => {
                                console.log(err);
                            });

            },

            /**
             * send delete Request to firebase
             */
            deleteComment(comment){
                
                this.templateComment =JSON.parse(JSON.stringify(comment));
                var request = {
                    uid:this.templateComment.commitKey,
                    doi:this.templateComment.doi_nr,
                }
                
                this.$store.dispatch("askFromUser/deleteComment",request).then(()=>{
                    this.getCommentList();
                });
            
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
             * @param comment - the comment which user wants to edit
             */
            openEditor(comment,index){
                this.templateComment =JSON.parse(JSON.stringify(comment));
                this.editorVisibility=[];
                this.editorVisibility[index] = true;
            },

            relate(comment){
              
                if(!this.searchDOI){
                    return true;
                }
                else if( comment.doi_nr.includes(this.searchDOI)){ 
                    return true
                }
                return false;
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