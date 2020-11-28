<template>
  <div class="bar">
    <div class="account">
<<<<<<< HEAD
      <accounticon class="icon" v-show="username"></accounticon>

      <login class="login" v-show="!username"></login>
      <register v-show="!username"></register>
=======
      <accounticon class="icon"  v-show="username"></accounticon>
      <div class="buttons">
        <login class="log" v-show="!username"></login>
        <register class="reg" v-show="!username"></register>
      </div>
      
>>>>>>> origin/main
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
<<<<<<< HEAD
.account {
  float: right;
  margin-right: 20px;
}

.icon {
  position: relative;

  border: 1px solid pink;
=======
.account{
  margin-right: 20px;
}
.icon {
  position:relative;
  float: right;
>>>>>>> origin/main
  width: 100px;
  height: 50px;
  float:right;
  margin-right: 50px;
}

<<<<<<< HEAD
.login {
  position: relative;
  /* top: -40px; */
  border: 1px solid yellow;
  width: 100px;
  height: 40px;
=======
.log{
  float: right;
  cursor: pointer; 
}
.reg{
  float: right;
  margin: 0 0px;
  cursor: pointer; 
>>>>>>> origin/main
}
</style>