<template>
    <div class="mainmess">

        <div v-if="Object.keys(Messagebox).length==0"> Your have no Message</div>
        <div v-for="(item,key) in Messagebox" v-bind:key="key" style="background:#ECECEC; margin-left:3vw; padding:1vw; ">

                <a-card  title="Message" >
                    
                    <a slot="extra">
                         <p @click="deleteMessage(key)">delete</p>
                    </a>
                   
                   <!-- Message about Comment -->
                   <div v-if="item.doi_nr" >
                       <h2>Your Request for FeedBack</h2>

                        <p>Comment Info</p>
                        <p>Go to this Book</p>
                        <p @click="seeDetail(item.doi_nr)" style="color:#76C06B;cursor:pointer;text-decoration: underline">{{item.doi_nr}}</p>
                        <b>Your Comments</b>
                        <p v-html="item.commentContent" class="ql-editor" style="margin:0;padding:0;max-height:25vh;overflow:auto;" ></p>
                        <br>
                        <b>Feedback:</b>
                        <p v-html="item.feedbackContent" class="ql-editor"></p>
                       
                   </div>

                   <!-- Message about Update Role -->
                   <div v-if="item.toRole">
                        <h2>Your Request about Update Role to {{item.toRole}}</h2>
                        <br>
                        <b>Feedback:</b>
                        <p v-html="item.feedbackContent" class="ql-editor"></p>                       
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

<style>
.mainmess{
    min-height: 88vh;
    background-color: #ECECEC;
}
.mainmess .ant-card-body{
    height: auto;
    overflow: hidden;
}
.mainmess .ant-card{
    width: 90vw;
    margin: 0;
}
</style>
