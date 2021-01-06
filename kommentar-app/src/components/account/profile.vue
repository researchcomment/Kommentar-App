<template>
  <div>
      <!-- Personal information -->
      <div @click="close" class="topbar">
        <div class="content">
          <i class="iconfont icon-yonghu"></i>{{username}}
        </div>
      </div>
      <ul class="fctlist">

        <!-- Admin -->
        <li v-show="isAdmin" @click="openRouter('admin')">
          <i class="iconfont icon-biaoqiankuozhan_guanli-159"></i>
          <div class="texts">
            Admin
          </div>
        </li>

        <!-- Reviewer -->
        <li v-show="isReviewer" @click="openRouter('review')">
          <i class="iconfont icon-biaoqiankuozhan_guanli-159"></i>
          <div class="texts">
            Review
          </div>
        </li>

        <!-- Personal Information -->
        <li  @click="openRouter('personal')">
          <i class="iconfont icon-biaoqiankuozhan_guanli-159"></i>
          <div class="texts">
            Personal_info
          </div>
        </li>

        <!-- MessageBox -->
        <li  @click="openRouter('messageBox')">
          <i class="iconfont icon-youxiang"></i>
            <a-badge :count="Object.keys(Messagebox).length">
              <div class="texts">
                Message
              </div>
            </a-badge>
            
        </li>

        <!-- Logout -->
        <li @click="logout">
          <i class="iconfont icon-tuichu5"></i>
          <div class="texts">
            Logout
          </div>
        </li>
      </ul>

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

    role(){
      return this.$store.state.account.role;
    },
    Messagebox()
    {
      return this.$store.state.account.Messagebox;
    },

    isAdmin(){
      return this.role?this.role.includes("Admin"):false;
          //check whether the logged user is Admin
    },

    isReviewer(){
      return this.role?this.role.includes("Reviewer"):false;
    },

  },
  methods:{
    close(){
      this.$emit('logout');
    },
    logout(){
      this.$store.dispatch('account/logout');
      this.$message({
          type: 'success',
          message: "Logout successfully. Goodbye!",
          duration: 1000
      });
      this.$emit('logout');
      let router=this.$router.currentRoute.name;
      if(router=="personal"||router=="admin"||router=="review"){
        this.$router.push('/');
      }

    },
   
    openRouter(router){
      let dis='/'+(router.charAt(0)).toUpperCase() + router.slice(1);
      if(this.$router.currentRoute.name!=router){
        this.$router.push(dis);
      }
      else{
        this.openNotification();
      }
    },

    openNotification() {
      var msg = "You are already on this page";
      this.$notification["warning"]({
        message: "Oops",
        placement:"topLeft",
        description:msg,
      });
    },
  
    
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
.fctlist i{
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