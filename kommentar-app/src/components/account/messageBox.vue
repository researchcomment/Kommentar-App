<template>
    <div>


        <div v-for="item in Messagebox" :key="item.key"   style="background:#ECECEC; padding:10px">

                <a-card  title="Message" >
                    
                    <a slot="extra" @click="deleteMessage(item.key)">delete</a>
                    
                    <a-descriptions  bordered  :column="{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }">
                        
                            <a-descriptions-item label="Book Link">
                                <p @click="seeDetail(item.doi_nr)">{{item.doi_nr}}</p>
                            </a-descriptions-item>

                            <a-descriptions-item label="Content">
                            <p v-html="item.commentContent"></p>
                            </a-descriptions-item>
                        </a-descriptions>
                        <b>Feedback:</b>

                    <p v-html="item.feedbackContent"></p>

                </a-card>

        </div>
        
        
    </div>
</template>

<script>
    export default {
        
        computed:{
            Messagebox(){
                return this.$store.state.account.Messagebox;
            },
            messageList(){
                return Object.keys(this.Messagebox).map((key) => {
                                    var comment = result[key];
                                    comment.key=key;
                                    return comment;
                                })
            }

        },
        methods:{

            deleteMessage(key){
                this.$store.dispatch("askFromUser/deleteMessageFromBox",{message_id:key});
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

<style lang="scss" scoped>

</style>
