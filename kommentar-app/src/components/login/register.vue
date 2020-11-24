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
export default {
  data(){
    return{
      formLabelWidth: '150px',
      dialogFormVisible: false,
      passwordComfirm:"",
      validationErrors: [],
      form:{
        username:"",
        password:"",
      },
    }
  },
    methods:{
      resetError() {
      this.validationErrors = [];
      },
      
      confirm(){
        if(this.form.username==""||this.form.password==""){
          //check if the form is filled
          this.validationErrors.push("Username/Password can not be empty.")
          this.$message.warning('Username/Password can not be empty.');
        }
      if (/.{6,}/.test(this.password) != true) {
        this.validationErrors.push("Password must be at least 6 characters long");
        this.$message.warning("Password must be at least 6 characters long");
      }
      if (!(this.form.password === this.passwordComfirm)) {
        this.validationErrors.push("Passwords did not match");
        this.$message.warning("Passwords did not match");
      }
      if (this.validationErrors.length <= 0) {
        this.signUp();
      }
      },
      signUp(){
        this.$store.dispatch('account/regist',this.form);
        }
      }

};
</script>

<style>

</style>