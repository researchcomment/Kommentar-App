<template>
  <div class="bar">
    <div class="account">
      <accounticon class="icon"  v-show="username"></accounticon>
      <div class="buttons">
        <login class="login" v-show="!username"></login>
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
  data(){
    return{
      
    }
  },
  computed:{
    username: function(){
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
.bar {
  width: 100%;
  height: 40px;
  
}
.account{
  margin-right: 20px;
}
.icon {
  position:relative;
  float: right;
  width: 40px;
  height: 40px;
  font-size: 50px;
  color: #746B6F
}

.login{
  float: right;
  
}
.reg{
  float: right;
  margin: 0 20px;
}
</style>