<template>
      <li>
        <div v-for="item in commentList" v-bind:key="item.id" >
            <comment :comment="item" />
        </div>
      </li>
    
</template>

<script>
import comment from "./comment"
export default {
    components:{
        comment,
    },
    data(){
        return {
            commentList:[
                        {content:"234234",
                            author:"xxxxx",},
                        {content:"234234",
                            author:"xxxxx",},
                        {content:"234234",
                            author:"xxxxx",}
                        ],
        }
    },
    created() {
     this.getComments();
    },
    beforeRouteUpdate(to, from, next) {
        next();
        this.getComments();
    },
    methods:{
        //ask data base the comments
        getComments(){
            this.commentList=[
                        {content:"234234",
                            author:"xxxxx",},
                        {content:"234234",
                            author:"xxxxx",},
                        {content:"234234",
                            author:"xxxxx",}
                        ];
        }
    }
        
}
</script>

<style lang="scss" scoped>

</style>