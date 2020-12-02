<template>
  <div>
      <!-- register Button -->
      <div class="reg" @click="dialogFormVisible = true">Register<span class="iconfont icon-zhuce"></span></div>
      
      <!-- After clicking, a register form will pop up -->
      <!-- <el-dialog title="Register" :visible.sync="dialogFormVisible">
        <el-form :model="form">
          <el-form-item label="Username"  :label-width="formLabelWidth">
            <el-input v-model="form.username" autocomplete="off" placeholder="Enter your E-Mail"></el-input>
          </el-form-item>
          
          <el-form-item label="Password"  :label-width="formLabelWidth">
            <el-input v-model="form.password" placeholder="Enter a password" autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item label="Confirm Password" :label-width="formLabelWidth" >
            <el-input v-model="passwordComfirm" placeholder="Comfirm your password"  autocomplete="off"></el-input>
            <span style="color:red" v-show="passwordNotMatch">Does not match password</span> 
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">Cancel</el-button>
          <el-button type="primary" @click.native="confirm">Confirm</el-button>
        </div>
      </el-dialog> -->
      <mt-popup class="popform" style="color:black" v-model="dialogFormVisible" popup-transition="popup-fade">
        <h3 class="formtitle">Welcome!</h3>
        <mt-field class="fieldarea" label="Username" placeholder="Enter your E-Mail" v-model="form.username"></mt-field>
          
        <mt-field class="fieldarea" label="Password" placeholder="Enter a password" v-model="form.password"></mt-field>
        
        <mt-field class="fieldarea" label="Confirm Password" placeholder="Comfirm your password"></mt-field>
        <span style="color:red;margin-left:6%;" v-show="passwordNotMatch">Does not match password</span>
        <div class="cbuttons">
          <el-button @click="dialogFormVisible = false">Cancel</el-button>
          <el-button type="primary" @click.native="confirm">Confirm</el-button>
        </div>
      </mt-popup>

  </div>
</template>

<script>
export default {
  data(){
    return{
      formLabelWidth: '150px',
      dialogFormVisible: false,
      passwordComfirm:"",
      validationErrors: [],
      passwordNotMatch:false,
      form:{
        username:"",
        password:"",
      },
    }
  },
    methods:{
      resetError() {
        this.validationErrors = [];
        this.passwordNotMatch=false;
      },
      
      /*
      * Check whether the form of account and password is correct
      */
      confirm(){
        this.resetError();
        //check if the form is filled
        if(!this.form.username||!this.form.password||!this.passwordComfirm){    
          this.validationErrors.push("Username/Password can not be empty.")
          this.$message.warning('Username/Password can not be empty.');
        }
        //check the form of the password
        if (/.{6,}/.test(this.form.password) != true) { 
          this.validationErrors.push("Password must be at least 6 characters long");
          this.$message.warning("Password must be at least 6 characters long");
        }
        //Test whether the passwords entered twice are the same
        if (!(this.form.password === this.passwordComfirm)) {
          this.validationErrors.push("Passwords did not match");
          this.passwordNotMatch=true;
          this.$message.warning("Passwords did not match");
        }
        if (this.validationErrors.length <= 0) {
          this.signUp();
        }
      },

      /*
      * Submit registration information
      */
      signUp(){
        this.$store.dispatch('account/regist',this.form);
      }
    }

};
</script>

<style>
.reg{
    width: 100px;
    height: 50px;
    font-size: 15px;
    line-height: 50px;
    color: #fff;
}
.iconfont icon-zhuce{
  font-size: inherit;
}

</style>