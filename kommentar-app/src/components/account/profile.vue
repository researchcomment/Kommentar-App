<template>
  <div>
      <!-- Personal information -->
      <p>Profile</p>
      <p> 
        <span>Username : </span>
        <span>{{username}}</span>
      </p>
      <p>
        <span>Role :</span> 
        <span>{{role}}</span>
      </p>

      <!-- Logout button -->
      <button @click="logout">Logout</button>
  </div>
</template>

<script>
export default {
  data(){
    return{

    }
  },
  computed:{
    username: function(){
      return this.$store.state.account.username;
    },
    role:function(){
      return this.$store.state.account.role;
    }
  },
  methods:{
    logout(){
      this.$store.dispatch('account/logout');
      this.$emit('logout');
    }
  }

}
</script>

<style>

</style>