<template>
    <div>
        <el-button type="primary" round>Login</el-button>
        <!-- [login Button]
        点击会弹出 login table
            [login Table
            username：
            password:
            (register button)]
            点一下会弹出注册表单 -->
            <register></register>
    </div>
</template>

<script>
import register from './register'
export default {
    components:{
        register,
    }
}
</script>

<style>

</style>