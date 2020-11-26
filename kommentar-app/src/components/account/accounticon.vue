<template>
    <div>
        
        <!-- Personal information will appear after clicking profile picture -->
        <el-popover
            placement="bottom"
            trigger="click"
            v-model="visible"
            >
            
            <!-- Personal information -->
            <profile @logout="logout"></profile>

            <!-- profile picture -->
            <!-- <img src="@/assets/user.jpeg" slot="reference" class="round_icon">  -->
            <i class="el-icon-user" slot="reference"></i>
            Your Account
        </el-popover>
        
    </div>
</template>

<script>
import profile from './profile'
    export default {
        components:{
            profile,
        },
        data(){
            return{
                visible:false,
            }    
        },
        methods:{
            logout(){
                this.visible = false;
            }
        }
    }
</script>

<style >


</style>