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
            
          </div>
        </li>

        <!-- Admin -->
        <li v-show="isAdmin" @click="openAdmin">
          <span class="iconfont icon-biaoqiankuozhan_guanli-159"></span>
          <div class="texts">
            Admin
          </div>
        </li>

        <!-- Reviewer -->
        <li v-show="isReviewer" @click="openReviewer">
          <span class="iconfont icon-biaoqiankuozhan_guanli-159"></span>
          <div class="texts">
            Reviewer
          </div>
        </li>

        <!-- Personal Information -->
        <li @click="openPersonal('role')">
          <span class="iconfont icon-biaoqiankuozhan_guanli-159"></span>
          <div class="texts">
            Personal_info
          </div>
        </li>

        <li  @click="openPersonal('messageBox')">
         <span class="iconfont icon-youxiang"></span>
              <div class="texts" >
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
      <!-- {{Messagebox}} -->
        <!-- <a-badge :count="Object.keys(Messagebox).length" show-zero style="font-size: xx-small;">
            <a href="#" class="head-example" />
          </a-badge> -->
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

    role(){
      return this.$store.state.account.role;
    },
    Messagebox()
    {
      return this.$store.state.account.Messagebox;
    },

    isAdmin(){
      if(this.role){
          //check whether the logged user is Admin
          return (this.role.indexOf("Admin"))>-1;
      }
      else{
          return false;
      }
    },

    isReviewer(){
      if(this.role){
          //check whether the logged user is Admin
          return (this.role.indexOf("Reviewer"))>-1;
      }
      else{
          return false;
      }
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
      var router=this.$router.currentRoute.name;
      if(router=="personal"||router=="admin"||router=="reviewer"){
        this.$router.push('/');
      }

      
    },
    openAdmin(){

      if(this.$router.currentRoute.name!="admin"){
        this.$router.push('/Admin');
      }
      else{
        this.openNotification();
      }
      
    },
    openReviewer(){
 
      if(this.$router.currentRoute.name!="reviewer"){
        this.$router.push('/Review');
      }
      else{
        this.openNotification();
      }
    },

    openPersonal(menuKey){
      var sameRouter=(this.$router.currentRoute.name=="personal");
      sameRouter = sameRouter && (this.$route.query.menu==menuKey);
      if(!sameRouter){
          this.$router.push({path:'/Personal',
                            query:{
                              menu:menuKey,
                            }});
         
          //this.$router.push('/Personal');
        
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