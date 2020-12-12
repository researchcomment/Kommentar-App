<template>
  <div>
      <!-- Personal information -->
      <div @click="close" class="topbar">
        <div class="content">
          <span class="iconfont icon-yonghu"></span>{{username}}
        </div>
      </div>
      <ul class="fctlist">
        <li>
          <span class="iconfont icon-jiaose"></span>
          <div class="texts">
            Role : {{role}}
          </div>
        </li>
        <li v-show="isAdmin" @click="openAdmin">
          <span class="iconfont icon-jiaose"></span>
          <div class="texts">
            Admin
          </div>
        </li>
        <li>
          <span class="iconfont icon-youxiang"></span>
          <div class="texts">
            Mailbox
          </div>
        </li>
        <li @click="logout">
          <span class="iconfont icon-tuichu5"></span>
          <div class="texts">
            Logout
          </div>
        </li>
      </ul>

      <!-- Logout button
      <button class="btn" @click="logout">Logout</button> -->
  </div>
</template>

<script>
export default {
  props:["username"],
  data(){
    return{

    }
  },
  computed:{
    role:function(){
      return this.$store.state.account.role;
    },
    isAdmin(){
      return true; //!for test
      if(this.username){
          //check whether the logged user is Admin
          return (this.role.indexOf("Admin"))>-1;
      }
      else{
          return false;
      }
    }
  },
  methods:{
    close(){
      this.$emit('logout');
    },
    logout(){
      this.$store.dispatch('account/logout');
      this.$emit('logout');
    },
    openAdmin(){
      this.$router.push('/Admin');
    }
  }

}
</script>

<style>
.fctlist{
  list-style-type: none;
  padding-left: 0;
  margin: 0;
}

.fctlist li{
  height: 12vh;
  width: 100%;
  border-bottom: 1px solid #EBEBEB;
  cursor: pointer;
  line-height: 12vh;
}
.topbar{
  height: 7vh;
  background-color:#00243E;
  color: #fff;
  line-height: 7vh;
  cursor: pointer;
}
.topbar .content{
  margin-left: 4vh;
  margin-right: auto;
  text-align: left;
}
.fctlist span{
  font-size: 4vh;
  color:#76C06B;
  margin-left: 10px;
  margin-right: auto;
  display: inline-block;
  margin-right: 2vh;
  vertical-align: middle;
}
.fctlist .texts{
  font-size: 3vh;
  display: inline-block;
  vertical-align: middle;
}

</style>