<template>
  <div>
    <!-- <el-popover placement="bottom" trigger="click" v-model="visible">
      Your Account
    </el-popover> -->
    <a-badge :count="Object.keys(Messagebox).length" dot>
      <div class="iconyonghu" @click="popout"><i class="iconfont icon-yonghu"></i><p style="font-size:2.2vh;display:inline">{{username}}</p></div>
    </a-badge>
    
    <mt-popup class="pop" v-model="visible" position="right" slot="reference">
        <profile class="prof" @logout="logout" :username="username"></profile>
    </mt-popup>
    <!-- <profile class="prof" v-show="visible" @logout="logout"></profile> -->
  </div>
</template>

<script>
import profile from "./profile";
export default {
  props:["username"],
  components: {
    profile,
  },
  data() {
    return {
      visible: false,
    };
  },
  computed:{
    Messagebox()
    {
      return this.$store.state.account.Messagebox;
    },
  },
  methods: {
    logout() {
      this.visible = false;
    },
    popout: function () {
        this.visible = !this.visible;
    }
  },
};
</script>

<style >
.iconyonghu{
    color:#fff;
    height: 50px;
    white-space:pre;
    cursor: pointer;
    z-index: 2;
}
.iconyonghu i{
  font-size: 2.2vh;
  display: inline;
}
.pop {
    height: 100%;
    width: 35vh;
}
</style>