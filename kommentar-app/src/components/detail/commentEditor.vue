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
    props:["doi","username","title"],
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
                            [{ 'font': [] }], 
                            [{ 'color': [] }],   // font color
                             
                            ]
                        }} 
        };
    },
    computed: {
        editor() {
            return this.$refs.quillEditor.quill;
        },

    },
    methods: {
        
        /**
         *  Send the request to the backend to store the comment
         *  It will be called when the submit button is clicked
         */
        submit(){

            // Ensure that the user is logged in
            if(!this.username){
                MessageBox.alert("Please login", "Notice");
                return;
            }

            // Send request to backend
            this.$store.dispatch('commitwork/sendFromEditorToDatabase',{
                doi:this.doi,
                author:this.$store.state.account.username,
                content:this.content,    // the comment is in html form 
                title:this.title
            }).then(() => {
                this.$emit("submit");
                this.content=null;
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

.quill-editor .ql-toolbar{
    padding: 0.5vh;
}

.quill-editor .ql-toolbar button svg{
    width: 2vh;
}
.quill-editor .ql-toolbar button{
    width: 3.5vh;
    padding: 0.4vh 0.4vh;
    margin: 0;
}
.quill-editor .ql-toolbar .ql-formats{
    margin-right: 1vh;
}
.quill-editor .ql-toolbar .ql-formats .ql-picker-label svg{
    width:2vh;
}
.quill-editor .ql-toolbar .ql-formats .ql-size{
    width: 12vh;
}
.quill-editor .ql-toolbar .ql-formats .ql-expanded .ql-picker-options{
    width: 12vh;
    overflow: scroll;
    height: 12vh;
}
.quill-editor .ql-container{
    height: 20vh;
}
</style>