<template>
  <div class="ocomment" v-loading.fullscreen.lock="loading">

    <!-- Title -->
    <h2 style="font-size: 2.5vw; color: #76c06b">
      Official Comments
      <span style="color: #ababab; font-size: 1.5vw">{{ comnum }}</span>
    </h2>

    <!-- List of official Comments -->
    <ul>
      <li v-for="item in commentList" v-bind:key="item.id" class="ocommentli">
        <div>
          <comment :comment="item" :username="username" @refresh="getComments"/>
        </div>
      </li>
    </ul>

  </div>
</template>

<script>
import comment from "./comment";

export default {
  props:["doi","username"],

  components: {
    comment,
  },

  data() {
    return {
      commentList: [
        // {content:"a test comment",
        //     author:"xxxxx",},
        // {content:"a test comment",
        //     author:"xxxxx",},
        // {content:"a test comment",
        //     author:"xxxxx",}
      ],
      loading: false,
    };
  },
  created() {
    this.getComments();
  },
  beforeRouteUpdate(to, from, next) {
    next();
    this.getComments();
  },
  computed: {
    comnum: function () {
      return this.commentList.length;
    },
  },
  methods: {


    /**
     * Request comment content from the backend
     */
    async getComments() {    
      
      // open the loading-animation 
      this.loading = true;
      
      // send request
      var result = await this.$store.dispatch(
                                              "commitwork/loadComments",
                                              {doi: this.doi, 
                                               rankType: "submittime", 
                                               username: this.$store.state.account.username ,
                                               type:"official"}
                                              );

      // !FOR TEST 
      // console.log(result);

      this.commentList = result;

      // close the loading-animation 
      this.loading = false;

    },


  },
};
</script>

<style>
.ocomment ul{
    list-style-type: none;
    padding: 1vw;
}
.ocomment{
    margin: 2vh 10vw;
}
.ocomment .ocommitli{
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
    font-size: 1.8vw;
}
.ant-comment-content-detail p{
    font-size: 1.8vw;
    margin-bottom: 0;
}
.ant-comment-actions{
    margin: 0;
    padding: 0;
}
.ant-comment-actions span{
    font-size: 2vw;
}
.ocomment .ant-comment-inner{
    padding: 0;
}
.ocomment .ant-comment-inner .ant-comment-avatar img{
    width: 4.5vw;
    height: 4.5vw;
    margin: 0;
}
.ocomment .ant-comment-inner .ant-comment-avatar .ant-avatar{
    width: 4.5vw;
    height: 4.5vw;
}
.ocomment .ant-comment-inner .ant-comment-avatar{
    margin-right: 3vw;
}
.ocomment .ant-comment-actions{
    margin-bottom: 4vh;
    padding: 0;
}
.ocomment .ant-comment .ant-comment-actions span span{
    font-size: 1.2vw;
}
.ocomment .ant-comment-actions i swg{
    width: 1.2vw;
    height: 1.2vw;
}
.ocomment .ant-comment-content-detail p{
    margin-bottom: 1vh;
}
</style>