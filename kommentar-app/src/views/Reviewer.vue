<template>
    <div>
        <!-- List of Comments -->
        <a-list item-layout="vertical" size="large" :pagination="pagination" :data-source="commentList">
                 
            <a-list-item v-if="(comment.status.length > 0)" slot="renderItem" slot-scope="comment" >
                
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

                    <a-descriptions-item label="Request">
                        <p v-for="item in comment.status" v-bind:key="item">{{item}}</p>
                    </a-descriptions-item>

                    <a-descriptions-item label="Content">
                       <p v-html="comment.content"></p>
                    </a-descriptions-item>

                </a-descriptions>


                <!-- Review Options -->
                <a-collapse v-model="activeKey">
                    <a-collapse-panel key="1" header="Send Review">
                    
                        <!-- Feedback -->
                        <div v-if="comment.status.indexOf('Review')>-1">
                            <p>Give Feedback</p>

                            <quill-editor
                            v-model="comment.replyContentReview"
                            :options="editorOptionReview">
                            </quill-editor>

                            <a-button type="primary" @click="replyReview(comment)">Send</a-button>
                        </div>

                        <!-- Reply for Permanent ID -->
                        <div v-if="comment.status.indexOf('PID')>-1">
                            <p>Give PermanentID</p>

                            <quill-editor
                            v-model="comment.replyContentPID"
                            :options="editorOptionPID">
                            </quill-editor>

                            <a-button type="primary" icon="check-circle" @click="replyPID(true,comment)">Agree</a-button>
                            <a-button type="primary" icon="close-circle" @click="replyPID(false,comment)">Refuse</a-button>
                            
                        </div>
                        
                    </a-collapse-panel>
                </a-collapse>
                

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
                activeKey: ['1'],

                editorOptionPID: {    // style for quill-editor by PID
                    placeholder: "Write your Reason......   \n(Must fill in, if the request is rejected)",
                    modules:{
                        toolbar:[
                                ['bold', 'italic', 'underline', 'strike'],    // toggled buttons
                                ['blockquote', ], 
                                [{ 'color': [] }],   // front color
                                ]
                            }
                }, 
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

        computed:{

            /**
             * @returns true, if the current user is Reviewer
             */
            isReviewer(){
                var role = this.$store.state.account.role;
                if(role){
                    return (this.$store.state.account.role.indexOf("Reviewer"))>-1; // check whether the logged user is Admin
                }
                else{
                    return false; // not logged => not Admin
                }

            }

        },

        beforeRouteEnter (to, from, next) {
            
            // check whether the user is authenticated,
             next(vm => {
                if(!vm.isReviewer){
                    alert("illegal access error");
                    next('/');
                }
                else next()
            })  

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
                // TODO:this.$store.....getCommentListInReview();
                // TODO:this.commentList = result;


                // !FOR TEST     
                var result = await this.$store.dispatch("commitwork/loadUnOfficialComments", 
                                                    {doi: "10.18034/abcra", 
                                                     rankType: 'submittime',
                                                     username: this.$store.state.account.username})
                                            .catch(err => {
                                                            console.log(err);
                                                         });
                this.commentList = result;
                for(var comment of this.commentList){
                    comment.status=["Review","PID"];
                }

                // close the loading-animation 
                this.loading=false; 

            },

            /**
             * ! 涉及后端交互 
             * ! 接口 replyPID(UID,agree,reason) reason can be empty
             * Send to the firebase whether the request for PermanentID is passed
             * 
             * @param agree {boolean}  - true, if the Reviewer is agree
             * @param comment
             */
            replyPID(agree,comment){
                var reason = comment.replyContentPID;

                if(agree){
                    //TODO this.$store.dispatch("replyPID",this.comment.UID,agree,reason);
                    // the reason can be empty hier
                }
                else{

                    // check if the reason is filled
                    if(!reason){
                        this.$error({
                            title: 'Error message',
                            content: 'Please write down your Reason (Must fill in, if the request is rejected)',
                        });
                        return;
                    }
                    else{
                        //TODO this.$store.dispatch("replyPID",this.comment.UID,agree,reason);
                    }
                }

                // Refresh the display, prompting success
                var index = comment.status.indexOf("PID");
                if (index > -1) {
                    comment.status.splice(index, 1);
                }
                this.$notification.open({
                    message: 'Success',
                    description:
                    'Your evaluation has been communicated.',
                    icon: <a-icon type="smile" style="color: #108ee9" />,
                });
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

                    this.$notification.open({
                        message: 'Success',
                        description:
                        'Your Feedback has been communicated.',
                        icon: <a-icon type="smile" style="color: #108ee9" />,
                    });

                    // Refresh the display, prompting success
                    var index = comment.status.indexOf("Review");
                    if (index > -1) {
                        comment.status.splice(index, 1);
                    }
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

        }

        
    }
</script>

<style>
.avatarp{
    font-size: 2.5vw;
    line-height: 4.4vw;
}
</style>