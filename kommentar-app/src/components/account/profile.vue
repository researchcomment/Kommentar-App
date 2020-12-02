<template>
  <div>
      <!-- Personal information -->
      <!-- <p>Profile</p>
      <p> 
        <span>Username : </span>
        <span>{{username}}</span>
      </p>
      <p>
        <span>Role :</span> 
        <span>{{role}}</span>
      </p> -->
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
    close(){
      this.$emit('logout');
    },
    logout(){
      this.$store.dispatch('account/logout');
      this.$emit('logout');
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
  height: 70px;
  width: 100%;
  border-bottom: 1px solid #EBEBEB;
  cursor: pointer;
}
.topbar{
  height: 50px;
  background-color:#00243E;
  color: #fff;
  line-height: 50px;
  cursor: pointer;
}
.topbar .content{
  margin-left: 20px;
  margin-right: auto;
  text-align: left;
}
.fctlist span{
  font-size: 25px;
  color:#76C06B;
  line-height: 70px;
  margin-left: 10px;
  margin-right: auto;
  width: 50px;
  height: 70px;
  float:left;
}
.fctlist .texts{
  line-height: 70px;
  font-size: 20px;
  float: left;
}
</style>