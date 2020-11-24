<template>
  <div>
    <el-container>
      <el-header>
        <Account></Account>
      </el-header>
      <el-main>
        <Home></Home>
      </el-main>
    </el-container>
    
    
    
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
