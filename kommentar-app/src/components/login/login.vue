<template>
    <div>
        <el-button type="primary" @click="dialogFormVisible = true" round> Login </el-button>
        <!-- [login Button]
        点击会弹出 login table
            [login Table
            username：
            password:
            (register button)]
            点一下会弹出注册表单 -->

        <el-dialog title="Login" :visible.sync="dialogFormVisible">
            <el-form :model="form">

                <el-form-item label="Username" :label-width="formLabelWidth">
                    <el-input v-model="form.username" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="Password" :label-width="formLabelWidth">
                    <el-input v-model="form.password" autocomplete="off"></el-input>
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
                formLabelWidth: '120px',
                dialogFormVisible: false,
                form:{
                    username:"",
                    password:"",
                },  
                validationErrors: [],
                firebaseError: ""
            };   
            },
        methods:{
            resetError() {
      this.validationErrors = [];
      },
            confirm(){
                this.resetError();

                if(!this.form.username||!this.form.password){    //check if the form is filled
                    this.validationErrors.push('Username/Password can not be empty.')
                    this.$message.warning('Username/Password can not be empty.');
                }
                if (this.validationErrors.length <= 0) {
                    this.$store.dispatch('account/login',this.form);
                    }
                    },
        }
    }
</script>

<style>

</style>