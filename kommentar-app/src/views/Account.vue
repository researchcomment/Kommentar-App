<template>
  <div class="bar">
    <div class="homepage" @click="goHome"><i class="iconfont icon-zhuye"></i>Home Page</div>
    <div class="account">
      <accounticon class="icon"  v-show="username" :username="username"></accounticon>
      <div class="buttons">
        <login class="log" v-show="!username"></login>
        <register class="reg" v-show="!username"></register>
      </div>
      
    </div>
  </div>
</template>

<script>

import accounticon from "@/components/account/accounticon";
import login from "@/components/login/login";
import register from "@/components/login/register";


export default {

  components: {
    accounticon,
    login,
    register,
  },

  data() {
    return {};
  },

  computed: {
    
    username() {
      return this.$store.state.account.username;
    },

  },
  
  methods:{
    
    goHome(){
      this.$router.push('/');
    },


  },

  mounted(){
   
  },
  
  watch:{
    
    
  }
}
</script>

<style>
body{
  margin:0;
}
.bar {
  width: 100%;
  height: 7vh;
  box-shadow: 2px 2px 5px #DBD5D7;
  background-color: #00243E;
  line-height: 7vh;
  font-size: 2.2vh;
}

.icon {
  position:relative;
  float: right;
  width: auto;
  height: 7vh;
  margin-right: 2vh;
}

.log{
  float: right;
  cursor: pointer; 
  margin-right: 2vh;
}
.reg{
  float: right;
  margin: 0 0px;
  cursor: pointer; 
  margin-right: 2vh;
}
.account{
  float: right;
}
.homepage{
  float: left;
  color: #fff;
  margin-left: 2vh;
  cursor: pointer;
  height: 7vh;
  
}
.homepage i{
  font-size: 2.2vh;
}
</style>