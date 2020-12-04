<template>
  <div class="bar">
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
  height: 50px;
  box-shadow: 2px 2px 5px #DBD5D7;
  background-color: #00243E;
}

.icon {
  position:relative;
  float: right;
  width: 100px;
  height: 50px;
  float:right;
  margin-right: 50px;
}

.log{
  float: right;
  cursor: pointer; 
}
.reg{
  float: right;
  margin: 0 0px;
  cursor: pointer; 
}
</style>