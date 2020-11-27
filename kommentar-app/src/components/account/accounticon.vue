<template>
  <div>
    <!-- <el-popover placement="bottom" trigger="click" v-model="visible">
      <profile @logout="logout"></profile>

      <i class="el-icon-user" style="color: #fff" slot="reference"></i>
      Your Account
    </el-popover> -->
    <div class="iconyonghu" @click="popout"><span class="iconfont icon-yonghu"></span>{{username}}</div>
    <mt-popup class="pop" v-model="visible" position="right" slot="reference">
         
        <profile class="prof" @logout="logout"></profile>
    </mt-popup>
    <!-- <profile class="prof" v-show="visible" @logout="logout"></profile> -->
        
    
  </div>
</template>

<script>
import profile from "./profile";
export default {
  components: {
    profile,
  },
  data() {
    return {
      visible: false,
    };
  },
  methods: {
    logout() {
      this.visible = false;
    },
    popout: function () {
        this.visible = !this.visible;
      }
  },
  computed:{
      username: function(){
      return this.$store.state.account.username;
    },
  }
};
</script>

<style >
.iconyonghu{
    color:#fff;
    font-size: 15px;
    line-height: 50px;
    width: 100px;
    height: 50px;
    white-space:pre;
    cursor: pointer;
    z-index: 2;
}
.pop {
    height: 100%;
    width: 250px;;

}
</style>