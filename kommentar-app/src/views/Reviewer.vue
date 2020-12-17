<template>
    <div>
        <!-- List of official Comments -->
        <a-collapse v-model="activeKey">

            <div v-for="comment in commentList" v-bind:key="comment.UID" >
                <a-collapse-panel  :key="comment.UID" :header="comment.author" :disabled="false">
                    <p>{{ text }}</p>
                </a-collapse-panel>
            </div>
        
        </a-collapse>


        <a-list item-layout="vertical" size="large" :pagination="pagination" :data-source="listData">
            <div slot="footer"><b>ant design vue</b> footer part</div>
                <a-list-item slot="renderItem" key="item.title" slot-scope="item, index">
            <template v-for="{ type, text } in actions" slot="actions">
                <span :key="type">
                <a-icon :type="type" style="margin-right: 8px" />
                {{ text }}
                </span>
            </template>
            <img
                slot="extra"
                width="272"
                alt="logo"
                src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
            />
            <a-list-item-meta :description="item.description">
                <a slot="title" :href="item.href">{{ item.title }}</a>
                <a-avatar slot="avatar" :src="item.avatar" />
            </a-list-item-meta>
            {{ item.content }}
            </a-list-item>
        </a-list>

    </div>
</template>

<script>
    export default {
        name:"review",
        data(){
            return{
                commentList:[],
            }
        },

        computed:{

            /**
             * @returns true, if the current user is Reviewer
             */
            isReviewer(){

                var login = this.$store.state.account.username;

                if(login){
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
             * ! 涉及后端交互
             * Request the CommentList, which status is "in Review", from background
             */
            getCommentList(){

                // get userList from DB
                // TODO:this.$store.....getUserList();

                //! FOR TEST
                this.commentList = [
                                    {
                                        UID:"MAKAVIVZSVSDFSDF",    // UID for comment 
                                        PermanentID:"",    // '' or 'ASDASDAS'
                                        type:"unofficial",    // "official", "unofficial"
                                        status:[],    // ["in Review", "ask for PID",...] 
                                        active:true,    // the Admin can hide the comments
                                        author:this.commentFromParent.author,
                                        content:this.commentFromParent.content,    // the comment is in html form 
                                        createDate: "2020-12-12",
                                        likes: 0,
                                        dislikes: 0,
                                    }, 
                    
                ];

            },

        }

        
    }
</script>

<style lang="scss" scoped>

</style>