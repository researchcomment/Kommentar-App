<template>
  <div class="bar">
    <div class="homepage" @click="goHome"><i class="iconfont icon-zhuye"></i>Home Page</div>
    <div class="account">
      <accounticon class="icon"  v-show="username"></accounticon>
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
import { Toast } from 'mint-ui';
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
    username: function () {
      return this.$store.state.account.username;
    },
  },
  methods:{
    goHome(){
      this.$router.push('/')
    },
  },
  watch:{
    //Monitor login/logout status and prompt success message
    username(newName,oldName){
      if((!oldName)&&newName){
        this.$message.success("Login successfully. Welcome!");
      }
      if((!newName)&&oldName){
        this.$message.success("Logout successfully. Goodbye!");
      }
    }

  }
};
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
  height: 50px;
  margin-right: 2vw;
}

.log{
  float: right;
  cursor: pointer; 
  margin-right: 2vw;
}
.reg{
  float: right;
  margin: 0 0px;
  cursor: pointer; 
  margin-right: 2vw;
}
.account{
  float: right;
}
.homepage{
  float: left;
  color: #fff;
  margin-left: 2vw;
  cursor: pointer;
}
</style>