<template>
    <div class="comeditor">

        <h3 style="font-size:1.8vw;color:#000">We need your opinion!</h3>
        
        <!-- No comment allowed when not logged in -->
        <div class="notlog" v-show="!username">Please login</div>
        
        <!-- Comment Editor -->
        <div v-show="username">

            <quill-editor
            v-model="content"
            ref="quillEditor" 
            :options="editorOption">
            </quill-editor>

            <button @click="submit" style="margin-top:2vh">Submit</button>

        </div>
        
    </div>
</template>

<script>
import moment from 'moment';
import { MessageBox } from 'mint-ui';

export default {
    props:["doi","username"],
    data() {
        return {
            rateValue: null,
            rateStyle: {fontSize: "35px"},
            content: null, 
            
            editorOption: {    // style for quill-editor
                placeholder: "Please write down your comment....",
                modules:{
                    toolbar:[
                            ['bold', 'italic', 'underline', 'strike'],    // toggled buttons
                            ['blockquote', 'code-block'], 
                            // [{ 'size': ['small', false, 'large', 'huge'] }], // front size
                            [{ 'color': [] }],   // front color
                            ]
                        }} 

        };
    },
    computed: {
        editor() {
            return this.$refs.quillEditor.quill;
        },

        /*! FOR TEST
        username: function () {
                //console.log(firebase.auth().currentUser.uid)
                return this.$store.state.account.username;
        },
        */

    },
    methods: {
        
        /**
         * TODO JJY has changed form of entry
         *  Send the request to the backend to store the comment
         *  It will be called when the submit button is clicked
         */
        submit(){

            // Ensure that the user is logged in
            if(!this.username){
                MessageBox.alert("Please login", "Notice");
                return;
            }

            // build request data
            var entry={
                // doi:this.doi,
                // username:this.$store.state.account.username,
                // content:this.content,    // the comment is in html form 

                //TODO JJY has changed form of entry
                doi:this.doi,

                author:this.$store.state.account.username,
                 
                content:this.content,    // the comment is in html form 

            }

            // Send request to backend
            let result=1;
            this.$store.dispatch('commitwork/sendFromEditorToDatabase',entry).then(() => {
                this.$emit("submit");
            }).catch(err => {
                console.log(err);
            })
            
        },
        


    },
   
};

</script>

<style>
.comeditor{
    margin-bottom: 5vh;
    margin-left: 10vw;
    margin-right: 10vw;
}

.comeditor .quill-editor .ql-toolbar{
    padding: 0.5vh;
}
.comeditor .quill-editor .ql-toolbar button svg{
    width: 2vh;
}
.comeditor .quill-editor .ql-toolbar button{
    width: 3.5vh;
    padding: 0.4vh 0.4vh;
}
.comeditor .quill-editor .ql-toolbar .ql-formats{
    margin-right: 1vh;
}
.comeditor .quill-editor .ql-toolbar .ql-formats .ql-size{
    width: 12vh;
}
.comeditor .quill-editor .ql-toolbar .ql-formats .ql-expanded .ql-picker-options{
    width: 12vh;
    overflow: scroll;
    height: 12vh;
}
.comeditor .quill-editor .ql-container{
    height: 20vh;
}
</style>