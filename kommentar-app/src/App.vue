<template>
  <div>
    <Account></Account>
    <router-view></router-view>
    <bottom></bottom>
  </div>
</template>

<script>
import Home from './views/Home'
import Account from './views/Account'
import bottom from '@/components/footer/bottom';

  export default {
    components:{
      Home,
      Account,
      bottom,
    },
  }
</script>
<style lang="scss" scoped>
  
</style>
