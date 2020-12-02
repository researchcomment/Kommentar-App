<template>
    <div>
        <quill-editor
            v-model="content"
            ref="quillEditor" 
            :options="editorOption"
            @focus="onEditorFocus()"
            @blur="onEditorBlur()"
        >
        </quill-editor>
        <button @click="submit">Submit</button>

        <!-- Test:Show the comment in html form -->
        <p>Test: 实时渲染html格式的comment</p>
        <div v-html="content">
	            {{content}}
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
                            ['image']//upload photos
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


</style>