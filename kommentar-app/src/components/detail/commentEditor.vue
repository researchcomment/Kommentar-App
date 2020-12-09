<template>
    <div class="comeditor">
        <h3 style="font-size:1.8vw;color:#000">We need your opinion!</h3>
        <div class="notlog" v-show="!username">Please login</div>
        <div v-show="username">
            <quill-editor
            v-model="content"
            ref="quillEditor" 
            :options="editorOption"
            @focus="onEditorFocus()"
            @blur="onEditorBlur()"
            
        >
        </quill-editor>
        <button @click="submit" style="margin-top:2vh">Submit</button>

        <!-- Test:Show the comment in html form -->
        <p style="margin-bottom:5vh">Test: 实时渲染html格式的comment</p>
        <div v-html="content">
	            {{content}}
        </div>
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
            editorOption: {
                placeholder: "Please write down your comment....",
                modules:{
                    toolbar:[
                            ['bold', 'italic', 'underline', 'strike'],    // toggled buttons
                            ['blockquote', 'code-block'], 
                            [{ 'size': ['small', false, 'large', 'huge'] }], // front size
                            [{ 'color': [] }],   // front color
                            ]
                        }} 

        };
    },
    computed: {
        editor() {
            return this.$refs.quillEditor.quill;
        }
        /*,
        username: function () {
                //console.log(firebase.auth().currentUser.uid)
                return this.$store.state.account.username;
        },
        */
    },
    methods: {
        //upload the comment to backend 
        submit(){
            if(!this.username){
                MessageBox.alert("Please login", "Notice");
                return;
            }
            var entry={
                doi:this.doi,
                username:this.username,
                content:this.content, //the comment is in html form 
            }
            
            this.$store.dispatch('commitwork/sendFromEditorToDatabase',entry)
        },
        onEditorFocus(){  // Focuses the editor 
            
        },
        onEditorBlur(){// Removes focus from the editor.
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