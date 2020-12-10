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
  mounted(){
    var username=sessionStorage.getItem("username")||localStorage.getItem("username");
    if(username){
      this.$store.commit("account/setusername",username);
    }
    
  },
  watch:{
    //Monitor login/logout status and prompt success message
    username(newName,oldName){
      var username=sessionStorage.getItem("username")||localStorage.getItem("username");
      if(username){
        return;
      }
      if((!oldName)&&newName){
        sessionStorage.setItem("username",newName); //cache account information
        this.$message({          //Cached account information will be deleted at account/logout
          type: 'success',
          message: "Login successfully. Welcome!",
          duration: 1000
        });
      }
      if((!newName)&&oldName){
        this.$message({
          type: 'success',
          message: "Logout successfully. Goodbye!",
          duration: 1000
        });
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
}
</style>