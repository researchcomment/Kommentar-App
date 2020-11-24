<template>
  <div class="bar">
    <div class="account">
      <accounticon class="icon"  v-show="username"></accounticon>
      
      <login class="login" v-show="!username"></login>
      <register class="register" v-show="!username"></register>
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
  }
};
</script>

<style>
.bar {
  width: 100%;
  height: 100%;
  box-shadow: 3px 3px 5px #E5E7EC;
  margin: 0px 0px;
}
.account{
  float: right;
  display: flex;
  align-items: center;
}


.icon {
  position:relative;
  border: 1px solid pink;
  width: 100px;
  height: 40px;
  float: right;
}

.login {
  position: relative;
  
  width: 100px;
  height: 40px;
  float: right;
}

.register{
  float: right;
}
</style>