<template>
  <div>
     <Account></Account>
     
      <router-view></router-view>
  </div>
</template>

<script>
import Home from './views/Home'
import Account from './views/Account'

  export default {
    components:{
      Home,
      Account,
    },
  }
</script>
<style lang="scss" scoped>
  
</style>
