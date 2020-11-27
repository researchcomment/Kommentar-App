<template>
<<<<<<< HEAD
  <div>
    accounticon
    <!-- <p>head photo</p>
         <p>(鼠标点击 会显示profile)</p> -->
    <!-- <p><profile></profile></p> -->
  </div>
</template>

<script>
import profile from "./profile";
export default {
  components: {
    profile,
  },
};
</script>

<style lang="scss" scoped>
=======
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
            <img src="@/assets/user.jpeg" slot="reference" class="round_icon"> 
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
.round_icon{
  width: 34px;
  height: 34px;
  display: flex;
  border-radius: 50%;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

>>>>>>> origin/jjy_szj/release
</style>