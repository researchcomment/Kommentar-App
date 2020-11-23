<template>
  <div>
      <el-button type="primary" @click="dialogFormVisible = true" round> Register </el-button>
        <!-- 点一下会弹出注册表单
            [
            username：
            password:
            ]
            点一下会弹出注册表单 -->

      <el-dialog title="Register" :visible.sync="dialogFormVisible">
        <el-form :model="form">
          <el-form-item label="Username" placeholder="Enter your username" :label-width="formLabelWidth">
            <el-input v-model="form.username" autocomplete="off"></el-input>
          </el-form-item>
          
          <el-form-item label="Password" placeholder="Enter a password" :label-width="formLabelWidth">
            <el-input v-model="form.password" autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item label="Confirm Password" placeholder="Comfirm your password" :label-width="formLabelWidth" >
            <el-input v-model="passwordComfirm" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">Cancel</el-button>
          <el-button type="primary" @click.native="confirm">Confirm</el-button>
        </div>
      </el-dialog>
  </div>
</template>

<script>
import firebase from "firebase/app";

export default {
  data(){
    return{
      formLabelWidth: '150px',
      dialogFormVisible: false,
      passwordComfirm:"",
      form:{
        username:"",
        password:"",
      },
    }
  },
    methods:{
      confirm(){
        if(this.form.username==""||this.form.password==""){    //check if the form is filled
          this.$message.warning('Username/Password can not be empty.');
        }
        this.checkForm();  
      },
      checkForm(){

      },

    }

      // when valid then sign in
      if (this.validationErrors.length <= 0) {
        this.signUp();
      }
    },
     signUp() {
      //use regist action in store/account.js
    }
  }
}
</script>

<style>

</style>