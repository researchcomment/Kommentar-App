<template>
  <div class="bar">
    <div class="account">
      <accounticon class="icon"  v-show="logged"></accounticon>
      
      <login class="login" v-show="!logged"></login>
      <register v-show="!logged"></register>
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
    logged: function(){
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
  height: 40px;
  border: 1px solid blue;
}
.account{
  float: right;
  margin-right: 20px;
}


.icon {
  position:relative;
  
  border: 1px solid pink;
  width: 100px;
  height: 40px;
}

.login {
  position: relative;
  /* top: -40px; */
  border: 1px solid yellow;
  width: 100px;
  height: 40px;
 
}
</style>