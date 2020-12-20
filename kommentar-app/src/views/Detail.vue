<template>
<div>
    <div class="maincontent">
        <div class="detailpage">

            <bookInfo :doi="doi"></bookInfo>

            <!-- officialComment -->
            <div class="ocomment" v-loading.fullscreen.lock="loading">

                <!-- Title -->
                <h2 style="font-size: 2.5vw; color: #76c06b">
                Official Comments
                <span style="color: #ababab; font-size: 1.5vw">{{ officialCommentList.length }}</span>
                </h2>

                <!-- List of official Comments -->
                <ul>
                <li v-for="(item,key) in officialCommentList" v-bind:key="key" class="ocommentli">
                    <div>
                    <comment :commentFromParent="item" :username="username" :UID="key" @refresh="getComments"/>
                    </div>
                </li>
                </ul>

            </div>

             <!-- unofficialComment -->
            <div class="ucomment" v-loading.fullscreen.lock="loading">

                <!-- Title -->
                <h2 style="font-size:2vw;color:#000">
                    Comments <span style="color:#ABABAB;font-size:1.5vw">{{unofficialCommentList.length}}</span>
                </h2>
                
                <!-- List of official Comments -->
                <ul>
                    <li v-for="(item,key) in unofficialCommentList" v-bind:key="key" class="ucommitli">
                        <div>
                            <comment :commentFromParent="item"  :username="username" :UID="key" @refresh="getComments"/>
                        </div>
                    </li>
                </ul>

            </div>   

            <commentEditor :doi="doi" :username="username" @submit="getComments"></commentEditor>

        </div>
    </div>
    <div>
    <bottom></bottom>
    </div>
</div>
    
</template>

<script>
    import bookInfo from "@/components/detail/bookInfo";
    import comment from "@/components/detail/comment"
    import commentEditor from "@/components/detail/commentEditor";
    import bottom from '@/components/footer/bottom';
    import firebase from 'firebase/app';

    export default {
        name:"detail",

        components:{
            bookInfo,
            commentEditor,
            bottom,
            comment,
        },

        data(){
            return{
                officialCommentList: [],
                unofficialCommentList: [],
                loading: false,
            }
        },

        created() {
            this.getComments();
        },

        beforeRouteUpdate(to, from, next) {
            next();
            this.getComments();
        },

        computed:{
            
            doi(){
                return this.$route.query.doi;
            },

            username: function () {
                //console.log(firebase.auth().currentUser.uid)
                return this.$store.state.account.username;
            },

        },


        methods:{
            
            // refresh the page
            // refresh(){
            //     window.location.reload();
            // },

            /**
             * Request comment content from the backend
             */
            async getComments() {    
            
                // open the loading-animation 
                this.loading = true;
                
                // send request
                this.officialCommentList = await this.$store.dispatch("commitwork/loadComments", 
                                                    {doi: this.doi, 
                                                     rankType: 'submittime',
                                                     username: this.$store.state.account.username,
                                                     type:"official"})
                                            .catch(err => {
                                                            console.log(err);
                                                         });

                this.unofficialCommentList = await this.$store.dispatch("commitwork/loadComments", 
                                                    {doi: this.doi, 
                                                     rankType: 'submittime',
                                                     username: this.$store.state.account.username,
                                                     type:"unofficial"})
                                            .catch(err => {
                                                            console.log(err);
                                                         });

                // close the loading-animation 
                this.loading = false;

            },
        }
        
    }
</script>

<style>

.ucomment ul{
    list-style-type: none;
    padding: 1vw;
}
.ucomment{
    margin: 2vh 10vw;
}
.ucomment .ucommitli{
    margin-bottom: 4vh;
    width: 70vw;
}
.ant-comment-inner{
    padding: 0;
}
.ant-comment-inner .ant-comment-content{
    border-bottom: 1px solid #EBEEF3;
}
.ant-comment-content-author .ant-comment-content-author-name a{
    font-size: 1.5vw;
}
.ant-comment-content-detail p{
    font-size: 1.5vw;
    margin-bottom: 0;
}
.ant-comment-actions{
    margin: 0;
    padding: 0;
}
.ant-comment-actions span{
    font-size: 2vw;
}
.ucomment .ant-comment-inner{
    padding: 0;
}
.ucomment .ant-comment-inner .ant-comment-avatar img{
    width: 4.5vw;
    height: 4.5vw;
    margin: 0;
}
.ucomment .ant-comment-inner .ant-comment-avatar .ant-avatar{
    width: 4.5vw;
    height: 4.5vw;
}
.ucomment .ant-comment-inner .ant-comment-avatar{
    margin-right: 3vw;
}
.ucomment .ant-comment-actions{
    margin-bottom: 4vh;
    padding: 0;
}
.ucomment .ant-comment .ant-comment-actions span span{
    font-size: 1.2vw;
}
.ucomment .ant-comment-actions i swg{
    width: 1.2vw;
    height: 1.2vw;
}
.ucomment .ant-comment-content-detail p{
    margin-bottom: 1vh;
}

</style>