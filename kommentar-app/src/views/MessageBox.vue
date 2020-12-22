<template>
    <div>

        <div v-if="Object.keys(Messagebox).length==0"> Your have no Message</div>
        <div v-for="(item,key) in Messagebox" v-bind:key="key" style="background:#ECECEC; padding:10px">

                <a-card  title="Message" >
                    
                    <a slot="extra">
                         <p @click="deleteMessage(key)">delete</p>
                    </a>
                   
                   <!-- Message about Comment -->
                   <div v-if="item.doi_nr">
                       <h2>Your Request for FeedBack</h2>
                        <a-descriptions  title="Comment Info" :column="1" >
                        
                            <a-descriptions-item label="Book Link">
                                <p @click="seeDetail(item.doi_nr)">{{item.doi_nr}}</p>
                            </a-descriptions-item>
                            
                            <a-descriptions-item label="Comments" >
                            <p v-html="item.commentContent"></p>
                            </a-descriptions-item>

                        </a-descriptions>
                    
                        <b>Feedback:</b>
                        <p v-html="item.feedbackContent"></p>
                       
                   </div>

                   <!-- Message about Update Role -->
                   <div v-if="item.toRole">
                        <h2>Your Request about Update Role to {{item.toRole}}</h2>
                        <br>
                        <b>Feedback:</b>
                        <p v-html="item.feedbackContent"></p>                       
                   </div>
                    
                </a-card>

        </div>
        
        
    </div>
</template>

<script>
    export default {
        name:"messageBox",

        computed:{
            Messagebox(){
                return this.$store.state.account.Messagebox;
            },

        },
        methods:{

            /**
             * send delete Request to firebase
             * @param key - the key of message
             */
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
