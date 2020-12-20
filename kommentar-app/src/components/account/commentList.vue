<template>
    <div>
        <!-- List of Comments -->
        <a-list item-layout="vertical" size="large" :pagination="pagination" :data-source="commentList">
                 
            <a-list-item v-if="comment.status.indexOf('Review')>-1" slot="renderItem" slot-scope="comment" >
                
                <!-- Detail about this comment -->
                <a-descriptions  bordered  :column="{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }">
                    <a-descriptions-item label="Create Date">{{comment.createDate}}</a-descriptions-item>
                    <a-descriptions-item label="type">{{comment.type}}</a-descriptions-item>
                    
                    <a-descriptions-item label="Book Link">
                        <p @click="seeDetail(comment.doi_nr)">{{comment.doi_nr}}</p>
                    </a-descriptions-item>

                    <a-descriptions-item label="Request under review">
                        <a-tag v-for="item in comment.status" v-bind:key="item">{{item}}</a-tag>
                    </a-descriptions-item>

                    <a-descriptions-item label="New Request">
                        
                        <!-- Review Request -->
                        <a-tag 
                        color="cyan" 
                        v-if="comment.status.indexOf('Review')<0"  
                        @click="newRequest('Review',comment)">
                        Review
                        </a-tag>

                        <!-- PID Request -->
                        <a-tag 
                        color="cyan" 
                        v-if="comment.status.indexOf('PID')<0 && role.indexOf('Researcher')>-1" 
                        @click="newRequest('PID',comment)">
                            PID
                        </a-tag>
                    </a-descriptions-item>

                    
                    <a-descriptions-item label="Content">
                       <p v-html="comment.content"></p>
                    </a-descriptions-item>

                </a-descriptions>

                

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



            }
        },

        computed: {
    
            username() {
                return this.$store.state.account.username;
            },

            role() {
                return this.$store.state.account.role;
            },

        },

        mounted(){
            this.getCommentList();
        },

        methods:{
            
            /**
             * ! 涉及后端交互 getCommentList(username) 
             * Request the CommentList, which Author is the user, from background
             */
            async getCommentList(){

                // open the loading-animation
                this.loading=true;

                // get CommentList form firebase, the status from these comments is "in Review"
                // TODO:this.$store.....getCommentList(this.username);
                // TODO:this.commentList = result;


                // !FOR TEST     
                var result = await this.$store.dispatch("commitwork/loadComments", 
                                                    {doi: "10.18034/abcra", 
                                                     rankType: 'submittime',
                                                     username: this.$store.state.account.username,
                                                     type:"unofficial"})
                                            .catch(err => {
                                                            console.log(err);
                                                         });
                this.commentList = result;
                for(var comment of this.commentList){
                    comment.status=["Review"];
                }

                // close the loading-animation 
                this.loading=false; 

            },

            
            /**
             * ! 涉及后端交互 
             * ! 接口 replyReview(UID,request)
             * Send request to the firebase
             * @param request - "Review" or "PID"
             */
            newRequest(request,comment){
               
                //TODO this.$store.dispatch("requestReview",this.comment.UID,request);

                // Refresh the display, prompting success
                comment.status.push(request);
                this.$notification.open({
                    message: 'Success',
                    description:
                    'Your Request has been submitted.',
                    icon: <a-icon type="smile" style="color: #108ee9" />,
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


        }

        
    }
</script>

<style>
.avatarp{
    font-size: 2.5vw;
    line-height: 4.4vw;
}
</style>